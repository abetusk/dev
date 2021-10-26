import dashify from 'dashify';
import indefiniteArticle from 'indefinite-article';
import { IAWSError, IAugmentedError, IErrorTemplate, IParameterObject, IVariable } from './interfaces';
import { TRenderFunction } from './types';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

const applyModifiers = (name: string, modifiers: string[]) => {
    if (modifiers === undefined) {
        return name;
    }

    return modifiers.reduce((modifiedName, modifier) => {
        if (modifier === 'capitalize') {
            const head = modifiedName.charAt(0).toUpperCase();
            const tail = modifiedName.slice(1);

            return `${head}${tail}`;
        }

        if (modifier === 'dashify') {
            return dashify(modifiedName);
        }

        if (modifier === 'prependIndefiniteArticle') {
            return `${indefiniteArticle(modifiedName)} ${modifiedName}`;
        }

        return modifiedName;
    }, name);
};

const buildRegex = (variable: IVariable) => {
    const expression = variable.name + variable.modifiers.map((modifier) => `\\.${modifier}\\(\\)`).join('');

    return new RegExp(`\\$\\{${expression}}`, 'g');
};

const preRenderString = (string: string, parameters: IParameterObject) => {
    const expressionRegex = /\${([^.}]+)((\.[^(]+\(\))*)}/g;

    const variables: IVariable[] = [];

    let expressionResult = expressionRegex.exec(string);

    while (expressionResult !== null) {
        const variable: IVariable = {
            modifiers: [],
            name: expressionResult[1]
        };

        if (expressionResult[3] !== undefined) {
            const modifiersRegex = /\.[^(]+\(\)/g;

            let modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);

            while (modifiersRegexResult !== null) {
                variable.modifiers.push(modifiersRegexResult[0].slice(1, -2));

                modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);
            }
        }

        variables.push(variable);

        expressionResult = expressionRegex.exec(string);
    }

    const preRenderedParts = variables.reduce(
        (parts: (string | TRenderFunction)[], variable: IVariable) =>
            parts
                .map((part) => {
                    if (typeof part === 'string') {
                        return part.split(buildRegex(variable)).reduce((prts: (string | TRenderFunction)[], prt: string, index: number) => {
                            if (index === 0) {
                                return [prt];
                            }

                            if (variable.name in parameters) {
                                return [...prts, applyModifiers(parameters[variable.name], variable.modifiers), prt];
                            }

                            return [...prts, (prmtrs: IParameterObject) => applyModifiers(prmtrs[variable.name], variable.modifiers), prt];
                        }, []);
                    }

                    return [part];
                })
                .reduce((prts: (string | TRenderFunction)[], part: (string | TRenderFunction)[]) => [...prts, ...part], []),
        [string]
    );

    return (missingParameters: IParameterObject) =>
        preRenderedParts
            .reduce((renderedParts: string[], preRenderedPart: string | TRenderFunction) => {
                if (typeof preRenderedPart === 'string') {
                    return [...renderedParts, preRenderedPart];
                }

                return [...renderedParts, preRenderedPart(missingParameters)];
            }, [])
            .join('');
};

export const compile = (template: IErrorTemplate, knownParameters: IParameterObject = {}) => {
    const renderCode = template.code === undefined ? undefined : preRenderString(template.code, knownParameters);
    const renderMessage = template.message === undefined ? undefined : preRenderString(template.message, knownParameters);

    function render(missingParameters: IParameterObject, cause?: Error | IAWSError): IAugmentedError;
    function render(cause: Error | IAWSError): IAugmentedError;
    function render(
        causeOrMissingParameters: Error | IAWSError | IParameterObject = {},
        optionalCause?: Error | IAWSError
    ): IAugmentedError {
        const hasNoOptionalCause =
            optionalCause === undefined &&
            (causeOrMissingParameters instanceof Error ||
                ((<IAWSError>causeOrMissingParameters).code !== undefined &&
                    (<IAWSError>causeOrMissingParameters).code.slice(-9) === 'Exception'));
        const { cause, missingParameters } = hasNoOptionalCause
            ? {
                  cause: <Error | IAWSError>causeOrMissingParameters,
                  missingParameters: {}
              }
            : {
                  cause: <Error | IAWSError>optionalCause,
                  missingParameters: <IParameterObject>causeOrMissingParameters
              };

        const err: IAugmentedError = <IAugmentedError>(
            (renderMessage === undefined ? new Error() : new Error(renderMessage(<IParameterObject>missingParameters)))
        );

        if (cause !== null) {
            err.cause = cause;
        }

        if (renderCode !== undefined) {
            err.code = renderCode(missingParameters);
        }

        if (template.status !== undefined) {
            err.status = template.status;
        }

        return err;
    }

    return render;
};

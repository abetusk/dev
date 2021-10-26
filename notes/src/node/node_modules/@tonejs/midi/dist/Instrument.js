"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InstrumentMaps_1 = require("./InstrumentMaps");
/**
 * @hidden
 */
var privateTrackMap = new WeakMap();
/**
 * Describes the midi instrument of a track
 */
var Instrument = /** @class */ (function () {
    /**
     * @param trackData
     * @param track
     */
    function Instrument(trackData, track) {
        /**
         * The instrument number
         */
        this.number = 0;
        privateTrackMap.set(this, track);
        this.number = 0;
        if (trackData) {
            var programChange = trackData.find(function (e) { return e.type === "programChange"; });
            if (programChange) {
                this.number = programChange.programNumber;
            }
        }
    }
    Object.defineProperty(Instrument.prototype, "name", {
        /**
         * The common name of the instrument
         */
        get: function () {
            if (this.percussion) {
                return InstrumentMaps_1.DrumKitByPatchID[this.number];
            }
            else {
                return InstrumentMaps_1.instrumentByPatchID[this.number];
            }
        },
        set: function (n) {
            var patchNumber = InstrumentMaps_1.instrumentByPatchID.indexOf(n);
            if (patchNumber !== -1) {
                this.number = patchNumber;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instrument.prototype, "family", {
        /**
         * The instrument family, e.g. "piano".
         */
        get: function () {
            if (this.percussion) {
                return "drums";
            }
            else {
                return InstrumentMaps_1.InstrumentFamilyByID[Math.floor(this.number / 8)];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Instrument.prototype, "percussion", {
        /**
         * If the instrument is a percussion instrument
         */
        get: function () {
            var track = privateTrackMap.get(this);
            return track.channel === 9;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Convert it to JSON form
     */
    Instrument.prototype.toJSON = function () {
        return {
            family: this.family,
            name: this.name,
            number: this.number,
        };
    };
    /**
     * Convert from JSON form
     */
    Instrument.prototype.fromJSON = function (json) {
        this.number = json.number;
    };
    return Instrument;
}());
exports.Instrument = Instrument;
//# sourceMappingURL=Instrument.js.map
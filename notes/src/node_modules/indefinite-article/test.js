function test_indefinite_article() {
    test_words = ["", "a", "g", "x", "user", "hour", "year", "Testing", "Otter", "Moose", "Bacon fillet", "Historic event", "Honorable Mention", "U.S. Currency", "Unified Front"]
    matches = ["an", "an", "a", "an", "a", "an", "a", "a", "an", "a", "a", "a", "an", "a", "a"];
    
    for (var i in test_words) {
        var w = test_words[i];
        var ia = window.indefiniteArticle(w);
        if (ia != matches[i]) {
            return "FAIL: Word: " + w + " doesn't match! '"+ matches[i] + "' != '" + ia + "'";
            return;
        }
    }
    
    return "Test Passes!";
}
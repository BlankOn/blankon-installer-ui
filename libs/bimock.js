BiKeyboardMock = function() {
}

BiKeyboardMock.prototype.available = function() {
  var keyboards = [
  { id: "enUS", title: "English US" },
  { id: "enUK", title: "English UK" },
    ];
  return keyboards;
}

BiLanguageMock = function() {
}

BiLanguageMock.prototype.available = function() {
  var langs = [
  { id: "id", title: "Bahasa Indonesia" },
  { id: "bew", title: "Base Betawi" },
  { id: "enUS", title: "English US" }
    ];

  return langs;
}

var BiKeyboard = BiKeyboard || BiKeyboardMock();
var BiLanguage = BiLanguage || BiLanguageMock();

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
    { id: "enUS", title: "English US" }
  ];

  return langs;
}

var BiKeyboard = BiKeyboard || new BiKeyboardMock();
var BiLanguage = BiLanguage || new BiLanguageMock();

window = window || {};
window.BiKeyboard = BiKeyboard;
window.BiLanguage = BiLanguage;

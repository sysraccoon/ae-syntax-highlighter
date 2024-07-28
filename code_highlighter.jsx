(function(thisObj) {
	"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,r,o,u,f,i=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(a)){for(u=a.length,n=0;u>n;n+=1)f[n]=str(n,a)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+i+"]":"["+f.join(",")+"]",gap=i,o}if(rep&&"object"==typeof rep)for(u=rep.length,n=0;u>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],o=str(r,a),o&&f.push(quote(r)+(gap?": ":":")+o));else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(o=str(r,a),o&&f.push(quote(r)+(gap?": ":":")+o));return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+i+"}":"{"+f.join(",")+"}",gap=i,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value);var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var r;if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var n,r,o=t[e];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r=walk(o,n),void 0!==r?o[n]=r:delete o[n]);return reviver.call(t,e,o)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();

    function LanguageInfo(name, alias) {
        this.name = name;
        this.alias = alias;
    }

    LanguageInfo.prototype.toString = function() {
        return this.name;
    }

    function ColorScheme(name, colors) {
        this.name = name;
        this.colors = colors;
    }

    ColorScheme.prototype.toString = function() {
        return this.name;
    }

    const animatorPrefix = "code_highlighter.";
    const scriptFolderPath = File($.fileName).path;
    const codeHighlighterDataPath = scriptFolderPath + encodeURI("/code_highlighter_data")
    const codeHighlighterColorSchemePath = codeHighlighterDataPath + encodeURI("/colorschemes")
    const codeTempFilePath = scriptFolderPath + encodeURI("/code_highlighter.tmp");
    const scriptFolderPathWinStyle = removeEndLines(system.callSystem("cmd.exe /c \"echo %cd%\""));
    const codeTokenizerPath = scriptFolderPathWinStyle + "\\code_highlighter_data\\code_tokenizer.exe";
    const codeTempFilePathWinStyle = scriptFolderPathWinStyle + "\\code_highlighter.tmp";

    var allColorSchemes = listAvailableColorSchemes();
    var allLanguages = listAvailableLanguages();

    var currentColorScheme = allColorSchemes[0];
    var currentLanguage = allLanguages[0];

    var ui = buildUI(thisObj);
    if (ui.toString() instanceof Panel) {
        ui;
    } else {
        ui.show();
    }

    function buildUI(thisObj) {
        var win =  (thisObj instanceof Panel) ? thisObj : new Window("palette", "Code Highlighter");

        var group = win.add("group", undefined, "");
        group.orientation = "column";

        group.add("statictext", undefined, "Language");

        var languageDropdown = group.add("dropdownlist", undefined, allLanguages);
        languageDropdown.selection = 0;
        languageDropdown.size = [90, 25];
        languageDropdown.onChange = function() {
            var index = languageDropdown.selection.index;
            currentLanguage = allLanguages[index];
        };

        group.add("statictext", undefined, "Color Scheme");

        var colorSchemeDropdown = group.add("dropdownlist", undefined, allColorSchemes);
        colorSchemeDropdown.selection = 0;
        colorSchemeDropdown.onChange = function() {
            var index = colorSchemeDropdown.selection.index;
            currentColorScheme = allColorSchemes[index];
        };

        var applyButton = group.add("button", undefined, "Apply");
        applyButton.onClick = function() {
            forEachActiveTextLayer(function(textLayer) {
                highlightTextLayer(textLayer, currentColorScheme.colors, currentLanguage.alias);
            });
        };

        var resetButton = group.add("button", undefined, "Reset");
        resetButton.onClick = function() {
            forEachActiveTextLayer(function(textLayer) {
                resetHighlightTextLayer(textLayer);
            });
        };

        return win;
    }

    function listAvailableLanguages() {
        var rawLanguages = callTokenizer("list-languages");
        var unprocessedLanguages = JSON.parse(rawLanguages);

        var resultlanguages = [
            new LanguageInfo("Auto-Detect"),
        ]

        for (var i = 0; i < unprocessedLanguages.length; i++) {
            var currUnprocessedLanguage = unprocessedLanguages[i];
            var language = new LanguageInfo(
                currUnprocessedLanguage["long_name"],
                currUnprocessedLanguage["aliases"][0],
            )
            resultlanguages.push(language);
        }

        return resultlanguages;
    }

    function listAvailableColorSchemes() {
        var colorSchemeDirectory = Folder(codeHighlighterColorSchemePath);
        if (colorSchemeDirectory instanceof File || !colorSchemeDirectory.exists) {
            alert("colorscheme directory not found");
            return [];
        }

        var files = colorSchemeDirectory.getFiles("*.json");
        var schemes = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var name = file.name.replace(/.json$/, "");
            var colors = getColorsForColorScheme(file);
            if (!colors) {
                continue;
            }
            var colorScheme = new ColorScheme(name, colors);
            schemes.push(colorScheme);
        }

        if (schemes.length == 0) {
            alert("Color Scheme list is empty");
        }

        return schemes;
    }

    function getColorsForColorScheme(colorSchemeFile) {
        if (!colorSchemeFile.exists) {
            return;
        }

        colorSchemeFile.open("r");
        var fileContent = colorSchemeFile.read();
        colorSchemeFile.close();

        return JSON.parse(fileContent)
    }

    function forEachActiveTextLayer(callback) {
        var comp = getActiveComp();
        var selectedLayers = getSelectedLayers(comp);

        var comp = getActiveComp();
        if(comp == null) {
            return
        }

        var selectedLayers = getSelectedLayers(comp);
        if (selectedLayers == null){
            return;
        }

        var textLayerFounded = false;

        forEachLayer(selectedLayers, function(selectedLayer){
            if (!(selectedLayer instanceof TextLayer)) {
                return;
            }
            textLayerFounded = true;
            callback(selectedLayer);
        });

        if (!textLayerFounded) {
            alert("Select text layer object");
        }
    }

    function resetHighlightTextLayer(textLayer) {
        var animators = textLayer.Text.Animators;

        var offset = 1;
        while (offset <= animators.numProperties) {
            var currAnimator = animators(offset);
            if (currAnimator.name.match("^" + animatorPrefix)) {
                currAnimator.remove();
            } else {
                offset += 1;
            }
        }
    }

    function highlightTextLayer(textLayer, colorScheme, language) {
        var textProp = textLayer.property("Source Text");
        var textDocument = textProp.value;

        var tokens = tokenize(textDocument.text, language);
        var groupedTokens = groupTokensByType(tokens);
        highlightTokenGroups(textLayer, groupedTokens, colorScheme);
    }

    function highlightTokenGroups(textLayer, groupedTokens, colorscheme) {
        resetHighlightTextLayer(textLayer);

        const INDEX_UNIT = 2;

        for (var groupName in groupedTokens) {
            if (!(groupName in colorscheme)) {
                continue;
            }
            var color = hexToRgb(colorscheme[groupName]);

            var animator = textLayer.Text.Animators.addProperty("ADBE Text Animator");
            animator.name = animatorPrefix + groupName;

            var fillColor = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
            fillColor.setValue(color);

            var tokens = groupedTokens[groupName];

            for (var i = 0; i < tokens.length; i++) {
                var currToken = tokens[i];

                var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
                selector.name = currToken.value;

                var advancedRangeSelector = selector.property("ADBE Text Range Advanced");
                var selectorUnits = advancedRangeSelector.property("Units");
                selectorUnits.setValue(INDEX_UNIT);

                var startProp = selector.property("ADBE Text Index Start");
                var endProp = selector.property("ADBE Text Index End");
                startProp.setValue(currToken.start);
                endProp.setValue(currToken.end);
            }
        }
    }

    function groupTokensByType(tokens) {
        var result = {}

        for (var i = 0; i < tokens.length; i++) {
            var currToken = tokens[i];
            var type = currToken.type;
            if (!(type in result)) {
                result[type] = [];
            }
            var tokenGroup = result[type];
            tokenGroup.push(currToken);
        }

        return result;
    }

    function tokenize(code, language) {
        var codeTempFile = new File(codeTempFilePath);

        writeFile(codeTempFile, code);

        languageOption = "";
        if (language) {
            languageOption = "--language " + JSON.stringify(language) + " ";
        }

        var rawTokenData = callTokenizer("tokenize --no-count-eol " + languageOption + JSON.stringify(codeTempFilePathWinStyle) + " -");
        var parsedTokens = JSON.parse(rawTokenData);
        return parsedTokens
    }

    function callTokenizer(args) {
        return system.callSystem(codeTokenizerPath + " " + args);
    }

    function writeFile(fileObj, fileContent, encoding) {
        encoding = encoding || "utf-8";
        fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);
        var parentFolder = fileObj.parent;

        if (!parentFolder.exists && !parentFolder.create()) {
            throw new Error("Cannot create file in path " + fileObj.fsName);
        }
    
        fileObj.encoding = encoding;
        fileObj.open("w");
        fileObj.write(fileContent);
        fileObj.close();
    
        return fileObj;
    }

    function getActiveComp() {
        var theComp = app.project.activeItem;
        if (theComp == undefined){
            var errorMsg = "Composition missed";
            alert(errorMsg);
            return null
        }

        return theComp
    }

    function getSelectedLayers(targetComp){
        var targetLayers = targetComp.selectedLayers;
        return targetLayers
    }

    function forEachLayer(targetLayerArray, doSomething) {
        for (var i = 0, ii = targetLayerArray.length; i < ii; i++){
            doSomething(targetLayerArray[i]);
        }
    }

    function removeEndLines(str) {
        return str.replace(/(\r\n|\n|\r)/gm, "");
    }

    function hexToRgb(hex) {
        var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
        return [
            parseInt(m[1], 16) / 255,
            parseInt(m[2], 16) / 255,
            parseInt(m[3], 16) / 255,
        ];
    }
})(this);
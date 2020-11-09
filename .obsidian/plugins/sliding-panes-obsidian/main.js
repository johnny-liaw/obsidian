'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var SlidingPanesPlugin = /** @class */ (function (_super) {
    __extends(SlidingPanesPlugin, _super);
    function SlidingPanesPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // helper variables
        _this.leavesOpenCount = 0;
        _this.activeLeafIndex = 0;
        // enable andy mode
        _this.enable = function () {
            // add the event handlers
            _this.app.workspace.on('resize', _this.recalculateLeaves);
            _this.app.workspace.on('file-open', _this.handleFileOpen);
            _this.app.vault.on('delete', _this.handleDelete);
            // wait for layout to be ready to perform the rest
            _this.app.workspace.layoutReady ? _this.reallyEnable() : _this.app.workspace.on('layout-ready', _this.reallyEnable);
        };
        // really enable things (once the layout is ready)
        _this.reallyEnable = function () {
            // we don't need the event handler anymore
            _this.app.workspace.off('layout-ready', _this.reallyEnable);
            // backup the function so I can restore it
            _this.rootSplitAny.oldOnChildResizeStart = _this.rootSplitAny.onChildResizeStart;
            _this.rootSplitAny.onChildResizeStart = _this.onChildResizeStart;
            // add some extra classes that can't fit in the styles.css
            // because they use settings
            _this.addStyle();
            // do all the calucations necessary for the workspace leaves
            _this.recalculateLeaves();
        };
        // shut down andy mode
        _this.disable = function () {
            // get rid of the extra style tag we added
            _this.removeStyle();
            // iterate through the root leaves to remove the stuff we added
            _this.app.workspace.iterateRootLeaves(function (leaf) {
                leaf.containerEl.style.width = null;
                leaf.containerEl.style.left = null;
                leaf.containerEl.style.right = null;
            });
            // restore the default functionality
            _this.rootSplitAny.onChildResizeStart = _this.rootSplitAny.oldOnChildResizeStart;
            // get rid of our event handlers
            _this.app.workspace.off('resize', _this.recalculateLeaves);
            _this.app.workspace.off('file-open', _this.handleFileOpen);
            _this.app.vault.off('delete', _this.handleDelete);
            _this.suggestionContainerObserver.disconnect();
        };
        // refresh funcion for when we change settings
        _this.refresh = function () {
            // re-load the style
            _this.updateStyle();
            // recalculate leaf positions
            _this.recalculateLeaves();
        };
        // remove the stlying elements we've created
        _this.removeStyle = function () {
            var el = document.getElementById('plugin-sliding-panes');
            if (el)
                el.remove();
            document.body.classList.remove('plugin-sliding-panes');
            document.body.classList.remove('plugin-sliding-panes-rotate-header');
            document.body.classList.remove('plugin-sliding-panes-header-alt');
            document.body.classList.remove('plugin-sliding-panes-stacking');
        };
        // add the styling elements we need
        _this.addStyle = function () {
            // add a css block for our settings-dependent styles
            var css = document.createElement('style');
            css.id = 'plugin-sliding-panes';
            document.getElementsByTagName("head")[0].appendChild(css);
            // add the main class
            document.body.classList.add('plugin-sliding-panes');
            // update the style with the settings-dependent styles
            _this.updateStyle();
        };
        // update the styles (at the start, or as the result of a settings change)
        _this.updateStyle = function () {
            // if we've got rotate headers on, add the class which enables it
            document.body.classList.toggle('plugin-sliding-panes-rotate-header', _this.settings.rotateHeaders);
            document.body.classList.toggle('plugin-sliding-panes-header-alt', _this.settings.headerAlt);
            // do the same for stacking
            document.body.classList.toggle('plugin-sliding-panes-stacking', _this.settings.stackingEnabled);
            // get the custom css element
            var el = document.getElementById('plugin-sliding-panes');
            if (!el)
                throw "plugin-sliding-panes element not found!";
            else {
                // set the settings-dependent css
                el.innerText = "\n        body.plugin-sliding-panes{--header-width:" + _this.settings.headerWidth + "px;}\n        body.plugin-sliding-panes .mod-root>.workspace-leaf{\n          width:" + (_this.settings.leafWidth + _this.settings.headerWidth) + "px;\n        }\n      ";
            }
        };
        // Recalculate the leaf sizing and positions
        _this.recalculateLeaves = function () {
            // rootSplit.children is undocumented for now, but it's easier to use for what we're doing.
            var leafCount = _this.rootSplitAny.children.length;
            var totalWidth = 0;
            // iterate through all the root-level leaves
            // keep the leaf as `any` to get the undocumented containerEl
            _this.rootSplitAny.children.forEach(function (leaf, i) {
                leaf.containerEl.style.left = _this.settings.stackingEnabled
                    ? (i * _this.settings.headerWidth) + "px"
                    : null;
                leaf.containerEl.style.right = _this.settings.stackingEnabled
                    ? (((leafCount - i - 1) * _this.settings.headerWidth) - leaf.containerEl.clientWidth) + "px"
                    : null;
                leaf.containerEl.style.flex = null;
                // keep track of the total width of all leaves
                totalWidth += leaf.containerEl.clientWidth;
            });
            // if the total width of all leaves is less than the width available,
            // add back the flex class so they fill the space
            if (totalWidth < _this.rootSplitAny.containerEl.clientWidth) {
                _this.rootSplitAny.children.forEach(function (leaf) {
                    leaf.containerEl.style.flex = '1 0 0';
                });
            }
        };
        // this function is called, not only when a file opens, but when the active pane is switched
        _this.handleFileOpen = function (e) {
            // put a small timeout on it because when a file is opened on the far right 
            // it wasn't focussing properly. The timeout fixes this
            setTimeout(function () {
                // check for a closed leaf and activate the adjacent leaf if it was
                _this.activateAdjacentLeafIfClosed(e);
                // focus on the newly selected leaf
                _this.focusLeaf(e);
            }, 10);
        };
        // check for a closed leaf and activate the adjacent leaf
        _this.activateAdjacentLeafIfClosed = function (e) {
            // first we need to figure out the count of open leaves
            var leafCount = _this.rootSplitAny.children.length;
            // use this value to check if we've set an active leaf yet
            var isActiveLeafSet = false;
            // if the number of open leaves has changed
            if (leafCount != _this.leavesOpenCount) {
                // if the number of leaves is < our last saved value, we must have closed one (or more)
                if (leafCount < _this.leavesOpenCount) {
                    // iterate through the leaves
                    _this.rootSplitAny.children.forEach(function (leaf, i) {
                        // if we haven't activated a leaf yet and this leaf is adjacent to the closed one
                        if (!isActiveLeafSet && (i >= _this.activeLeafIndex - 1)) {
                            // set the active leaf (undocumented, hence `any`)
                            _this.app.workspace.setActiveLeaf(leaf);
                            isActiveLeafSet = true;
                            // set the index for next time, also.
                            _this.activeLeafIndex = i;
                        }
                    });
                }
                // set the new open count
                _this.leavesOpenCount = leafCount;
                // recalculate leaf positions
                _this.recalculateLeaves();
            }
        };
        _this.focusLeaf = function (file) {
            // get back to the leaf which has been andy'd (`any` because parentSplit is undocumented)
            var activeLeaf = _this.app.workspace.activeLeaf;
            while (activeLeaf != null && activeLeaf.parentSplit != null && activeLeaf.parentSplit != _this.app.workspace.rootSplit) {
                activeLeaf = activeLeaf.parentSplit;
            }
            if (activeLeaf != null) {
                // get the index of the active leaf
                // also, get the position of this leaf, so we can scroll to it
                // as leaves are resizable, we have to iterate through all leaves to the
                // left until we get to the active one and add all their widths together
                var position_1 = 0;
                _this.activeLeafIndex = -1;
                _this.rootSplitAny.children.forEach(function (leaf, index) {
                    // this is the active one
                    if (leaf == activeLeaf) {
                        _this.activeLeafIndex = index;
                        leaf.containerEl.classList.remove('mod-am-left-of-active');
                        leaf.containerEl.classList.remove('mod-am-right-of-active');
                    }
                    else if (_this.activeLeafIndex == -1 || index < _this.activeLeafIndex) {
                        // this is before the active one, add the width
                        position_1 += leaf.containerEl.clientWidth;
                        leaf.containerEl.classList.add('mod-am-left-of-active');
                        leaf.containerEl.classList.remove('mod-am-right-of-active');
                    }
                    else {
                        // this is right of the active one
                        leaf.containerEl.classList.remove('mod-am-left-of-active');
                        leaf.containerEl.classList.add('mod-am-right-of-active');
                    }
                });
                // get the total leaf count
                var leafCount = _this.rootSplitAny.children.length;
                // get this leaf's left value (the amount of space to the left for sticky headers)
                var left = parseInt(activeLeaf.containerEl.style.left) || 0;
                // the amount of space to the right we need to leave for sticky headers
                var headersToRightWidth = _this.settings.stackingEnabled ? (leafCount - _this.activeLeafIndex - 2) * _this.settings.headerWidth : 0;
                // the root element we need to scroll
                var rootEl = _this.rootSplitAny.containerEl;
                // it's too far left
                if (rootEl.scrollLeft > position_1 - left) {
                    // scroll the left side of the pane into view
                    rootEl.scrollTo({ left: position_1 - left, top: 0, behavior: 'smooth' });
                }
                // it's too far right
                else if (rootEl.scrollLeft + rootEl.clientWidth < position_1 + activeLeaf.containerEl.clientWidth + headersToRightWidth) {
                    // scroll the right side of the pane into view
                    rootEl.scrollTo({ left: position_1 + activeLeaf.containerEl.clientWidth + headersToRightWidth - rootEl.clientWidth, top: 0, behavior: 'smooth' });
                }
            }
        };
        // hande when a file is deleted
        _this.handleDelete = function (file) {
            // close any leaves with the deleted file open
            // detaching a leaf while iterating messes with the iteration
            var leavesToDetach = [];
            _this.app.workspace.iterateRootLeaves(function (leaf) {
                if (leaf.view instanceof obsidian.FileView && leaf.view.file == file) {
                    leavesToDetach.push(leaf);
                }
            });
            leavesToDetach.forEach(function (leaf) { return leaf.detach(); });
        };
        _this.positionSuggestionContainer = function (scNode) {
            var cmEditor = _this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
            // find the open bracket to the left of or at the cursor
            var cursorPosition = cmEditor.getCursor();
            var currentToken = cmEditor.getTokenAt(cmEditor.getCursor());
            var currentLinkPosition;
            if (currentToken.string === '[]') { // there is no text within the double brackets yet
                currentLinkPosition = cursorPosition;
            }
            else { // there is text within the double brackets
                var lineTokens = cmEditor.getLineTokens(cursorPosition.line);
                var previousTokens = lineTokens.filter(function (token) { return token.start <= currentToken.start; }).reverse();
                var openBracketsToken = previousTokens.find(function (token) { return token.string.contains('['); });
                // position the suggestion container to just underneath the end of the open brackets
                currentLinkPosition = { line: cursorPosition.line, ch: openBracketsToken.end };
            }
            var scCoords = cmEditor.charCoords(currentLinkPosition);
            // make sure it fits within the window
            var appContainerEl = _this.app.dom.appContainerEl;
            var scRight = scCoords.left + scNode.offsetWidth;
            var appWidth = appContainerEl.offsetWidth;
            if (scRight > appWidth) {
                scCoords.left -= scRight - appWidth;
            }
            // set the left coord
            // the top coord is set by Obsidian and is correct.
            // it's also a pain to try to recalculate so I left it out.
            scNode.style.left = Math.max(scCoords.left, 0) + 'px';
        };
        // overriden function for rootSplit child resize
        _this.onChildResizeStart = function (leaf, event) {
            // only really apply this to vertical splits
            if (_this.rootSplitAny.direction === "vertical") {
                // this is the width the leaf started at before resize
                var startWidth_1 = leaf.containerEl.clientWidth;
                // the mousemove event to trigger while resizing
                var mousemove_1 = function (e) {
                    // get the difference between the first position and current
                    var deltaX = e.pageX - event.pageX;
                    // adjust the start width by the delta
                    leaf.containerEl.style.width = startWidth_1 + deltaX + "px";
                };
                // the mouseup event to trigger at the end of resizing
                var mouseup_1 = function () {
                    // if stacking is enabled, we need to re-jig the "right" value
                    if (_this.settings.stackingEnabled) {
                        // we need the leaf count and index to calculate the correct value
                        var leafCount = _this.rootSplitAny.children.length;
                        var leafIndex = _this.rootSplitAny.children.findIndex(function (l) { return l == leaf; });
                        leaf.containerEl.style.right = (((leafCount - leafIndex - 1) * _this.settings.headerWidth) - leaf.containerEl.clientWidth) + "px";
                    }
                    // remove these event listeners. We're done with them
                    document.removeEventListener("mousemove", mousemove_1);
                    document.removeEventListener("mouseup", mouseup_1);
                };
                // Add the above two event listeners
                document.addEventListener("mousemove", mousemove_1);
                document.addEventListener("mouseup", mouseup_1);
            }
        };
        return _this;
    }
    Object.defineProperty(SlidingPanesPlugin.prototype, "rootSplitAny", {
        // helper gets for any casts (for undocumented API stuff)
        get: function () { return this.app.workspace.rootSplit; },
        enumerable: false,
        configurable: true
    });
    // when the plugin is loaded
    SlidingPanesPlugin.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, observerTarget, observerConfig;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // load settings
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        // load settings
                        _a.settings = (_b.sent()) || new SlidingPanesSettings();
                        // if it's not disabled in the settings, enable it
                        if (!this.settings.disabled) {
                            this.enable();
                        }
                        // add the settings tab
                        this.addSettingTab(new SlidingPanesSettingTab(this.app, this));
                        // add the toggle on/off command
                        this.addCommand({
                            id: 'toggle-sliding-panes',
                            name: 'Toggle Sliding Panes',
                            callback: function () {
                                // switch the disabled setting and save
                                _this.settings.disabled = !_this.settings.disabled;
                                _this.saveData(_this.settings);
                                // disable or enable as necessary
                                _this.settings.disabled ? _this.disable() : _this.enable();
                            }
                        });
                        // add a command to toggle stacking
                        this.addCommand({
                            id: 'toggle-sliding-panes-stacking',
                            name: 'Toggle Stacking',
                            callback: function () {
                                // switch the setting, save and refresh
                                _this.settings.stackingEnabled = !_this.settings.stackingEnabled;
                                _this.saveData(_this.settings);
                                _this.refresh();
                            }
                        });
                        // add a command to toggle rotated headers
                        this.addCommand({
                            id: 'toggle-sliding-panes-rotated-headers',
                            name: 'Toggle Rotated Headers',
                            callback: function () {
                                // switch the setting, save and refresh
                                _this.settings.rotateHeaders = !_this.settings.rotateHeaders;
                                _this.saveData(_this.settings);
                                _this.refresh();
                            }
                        });
                        // add a command to toggle swapped header direction
                        this.addCommand({
                            id: 'toggle-sliding-panes-header-alt',
                            name: 'Swap rotated header direction',
                            callback: function () {
                                // switch the setting, save and refresh
                                _this.settings.headerAlt = !_this.settings.headerAlt;
                                _this.saveData(_this.settings);
                                _this.refresh();
                            }
                        });
                        // observe the app-container for when the suggestion-container appears
                        this.suggestionContainerObserver = new MutationObserver(function (mutations) {
                            mutations.forEach(function (mutation) {
                                mutation.addedNodes.forEach(function (node) {
                                    if (node.className === 'suggestion-container') {
                                        _this.positionSuggestionContainer(node);
                                    }
                                });
                            });
                        });
                        observerTarget = this.app.dom.appContainerEl;
                        observerConfig = { childList: true };
                        this.suggestionContainerObserver.observe(observerTarget, observerConfig);
                        return [2 /*return*/];
                }
            });
        });
    };
    // on unload, perform the same steps as disable
    SlidingPanesPlugin.prototype.onunload = function () {
        this.disable();
    };
    return SlidingPanesPlugin;
}(obsidian.Plugin));
var SlidingPanesSettings = /** @class */ (function () {
    function SlidingPanesSettings() {
        this.headerWidth = 32;
        this.leafWidth = 700;
        this.disabled = false;
        this.rotateHeaders = true;
        this.headerAlt = false;
        this.stackingEnabled = true;
    }
    return SlidingPanesSettings;
}());
var SlidingPanesSettingTab = /** @class */ (function (_super) {
    __extends(SlidingPanesSettingTab, _super);
    function SlidingPanesSettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.plugin = plugin;
        return _this;
    }
    SlidingPanesSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Toggle Sliding Panes")
            .setDesc("Turns sliding panes on or off globally")
            .addToggle(function (toggle) { return toggle.setValue(!_this.plugin.settings.disabled)
            .onChange(function (value) {
            _this.plugin.settings.disabled = !value;
            _this.plugin.saveData(_this.plugin.settings);
            if (_this.plugin.settings.disabled) {
                _this.plugin.disable();
            }
            else {
                _this.plugin.enable();
            }
        }); });
        new obsidian.Setting(containerEl)
            .setName('Leaf Width')
            .setDesc('The width of a single pane')
            .addText(function (text) { return text.setPlaceholder('Example: 700')
            .setValue((_this.plugin.settings.leafWidth || '') + '')
            .onChange(function (value) {
            _this.plugin.settings.leafWidth = parseInt(value.trim());
            _this.plugin.saveData(_this.plugin.settings);
            _this.plugin.refresh();
        }); });
        new obsidian.Setting(containerEl)
            .setName("Toggle rotated headers")
            .setDesc("Rotates headers to use as spines")
            .addToggle(function (toggle) { return toggle.setValue(_this.plugin.settings.rotateHeaders)
            .onChange(function (value) {
            _this.plugin.settings.rotateHeaders = value;
            _this.plugin.saveData(_this.plugin.settings);
            _this.plugin.refresh();
        }); });
        new obsidian.Setting(containerEl)
            .setName("Swap rotated header direction")
            .setDesc("Swaps the direction of rotated headers")
            .addToggle(function (toggle) { return toggle.setValue(_this.plugin.settings.headerAlt)
            .onChange(function (value) {
            _this.plugin.settings.headerAlt = value;
            _this.plugin.saveData(_this.plugin.settings);
            _this.plugin.refresh();
        }); });
        new obsidian.Setting(containerEl)
            .setName("Toggle stacking")
            .setDesc("Panes will stack up to the left and right")
            .addToggle(function (toggle) { return toggle.setValue(_this.plugin.settings.stackingEnabled)
            .onChange(function (value) {
            _this.plugin.settings.stackingEnabled = value;
            _this.plugin.saveData(_this.plugin.settings);
            _this.plugin.refresh();
        }); });
        new obsidian.Setting(containerEl)
            .setName('Spine Width')
            .setDesc('The width of the rotated header (or gap) for stacking')
            .addText(function (text) { return text.setPlaceholder('Example: 32')
            .setValue((_this.plugin.settings.headerWidth || '') + '')
            .onChange(function (value) {
            _this.plugin.settings.headerWidth = parseInt(value.trim());
            _this.plugin.saveData(_this.plugin.settings);
            _this.plugin.refresh();
        }); });
    };
    return SlidingPanesSettingTab;
}(obsidian.PluginSettingTab));

module.exports = SlidingPanesPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0ICcuL3N0eWxlcy5zY3NzJ1xuaW1wb3J0IHsgQXBwLCBGaWxlVmlldywgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBUQWJzdHJhY3RGaWxlLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgRWRpdG9yLCBQb3NpdGlvbiwgVG9rZW4gfSBmcm9tICdjb2RlbWlycm9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGluZ1BhbmVzUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgc2V0dGluZ3M6IFNsaWRpbmdQYW5lc1NldHRpbmdzO1xuXG4gIC8vIGhlbHBlciB2YXJpYWJsZXNcbiAgcHJpdmF0ZSBsZWF2ZXNPcGVuQ291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgYWN0aXZlTGVhZkluZGV4OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHN1Z2dlc3Rpb25Db250YWluZXJPYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcblxuICAvLyBoZWxwZXIgZ2V0cyBmb3IgYW55IGNhc3RzIChmb3IgdW5kb2N1bWVudGVkIEFQSSBzdHVmZilcbiAgcHJpdmF0ZSBnZXQgcm9vdFNwbGl0QW55KCk6IGFueSB7IHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2Uucm9vdFNwbGl0OyB9XG5cbiAgLy8gd2hlbiB0aGUgcGx1Z2luIGlzIGxvYWRlZFxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgLy8gbG9hZCBzZXR0aW5nc1xuICAgIHRoaXMuc2V0dGluZ3MgPSBhd2FpdCB0aGlzLmxvYWREYXRhKCkgfHwgbmV3IFNsaWRpbmdQYW5lc1NldHRpbmdzKCk7XG5cbiAgICAvLyBpZiBpdCdzIG5vdCBkaXNhYmxlZCBpbiB0aGUgc2V0dGluZ3MsIGVuYWJsZSBpdFxuICAgIGlmICghdGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5lbmFibGUoKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIHNldHRpbmdzIHRhYlxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU2xpZGluZ1BhbmVzU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuICAgIC8vIGFkZCB0aGUgdG9nZ2xlIG9uL29mZiBjb21tYW5kXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiAndG9nZ2xlLXNsaWRpbmctcGFuZXMnLFxuICAgICAgbmFtZTogJ1RvZ2dsZSBTbGlkaW5nIFBhbmVzJyxcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgIC8vIHN3aXRjaCB0aGUgZGlzYWJsZWQgc2V0dGluZyBhbmQgc2F2ZVxuICAgICAgICB0aGlzLnNldHRpbmdzLmRpc2FibGVkID0gIXRoaXMuc2V0dGluZ3MuZGlzYWJsZWQ7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG5cbiAgICAgICAgLy8gZGlzYWJsZSBvciBlbmFibGUgYXMgbmVjZXNzYXJ5XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuZGlzYWJsZWQgPyB0aGlzLmRpc2FibGUoKSA6IHRoaXMuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgYSBjb21tYW5kIHRvIHRvZ2dsZSBzdGFja2luZ1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ3RvZ2dsZS1zbGlkaW5nLXBhbmVzLXN0YWNraW5nJyxcbiAgICAgIG5hbWU6ICdUb2dnbGUgU3RhY2tpbmcnLFxuICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgLy8gc3dpdGNoIHRoZSBzZXR0aW5nLCBzYXZlIGFuZCByZWZyZXNoXG4gICAgICAgIHRoaXMuc2V0dGluZ3Muc3RhY2tpbmdFbmFibGVkID0gIXRoaXMuc2V0dGluZ3Muc3RhY2tpbmdFbmFibGVkO1xuICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGFkZCBhIGNvbW1hbmQgdG8gdG9nZ2xlIHJvdGF0ZWQgaGVhZGVyc1xuICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICBpZDogJ3RvZ2dsZS1zbGlkaW5nLXBhbmVzLXJvdGF0ZWQtaGVhZGVycycsXG4gICAgICBuYW1lOiAnVG9nZ2xlIFJvdGF0ZWQgSGVhZGVycycsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAvLyBzd2l0Y2ggdGhlIHNldHRpbmcsIHNhdmUgYW5kIHJlZnJlc2hcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5yb3RhdGVIZWFkZXJzID0gIXRoaXMuc2V0dGluZ3Mucm90YXRlSGVhZGVycztcbiAgICAgICAgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgYSBjb21tYW5kIHRvIHRvZ2dsZSBzd2FwcGVkIGhlYWRlciBkaXJlY3Rpb25cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6ICd0b2dnbGUtc2xpZGluZy1wYW5lcy1oZWFkZXItYWx0JyxcbiAgICAgIG5hbWU6ICdTd2FwIHJvdGF0ZWQgaGVhZGVyIGRpcmVjdGlvbicsXG4gICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAvLyBzd2l0Y2ggdGhlIHNldHRpbmcsIHNhdmUgYW5kIHJlZnJlc2hcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5oZWFkZXJBbHQgPSAhdGhpcy5zZXR0aW5ncy5oZWFkZXJBbHQ7XG4gICAgICAgIHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gb2JzZXJ2ZSB0aGUgYXBwLWNvbnRhaW5lciBmb3Igd2hlbiB0aGUgc3VnZ2VzdGlvbi1jb250YWluZXIgYXBwZWFyc1xuICAgIHRoaXMuc3VnZ2VzdGlvbkNvbnRhaW5lck9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSk6IHZvaWQgPT4ge1xuICAgICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCk6IHZvaWQgPT4ge1xuICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGU6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgIGlmIChub2RlLmNsYXNzTmFtZSA9PT0gJ3N1Z2dlc3Rpb24tY29udGFpbmVyJykge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblN1Z2dlc3Rpb25Db250YWluZXIobm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbnN0IG9ic2VydmVyVGFyZ2V0OiBOb2RlID0gKHRoaXMuYXBwIGFzIGFueSkuZG9tLmFwcENvbnRhaW5lckVsO1xuICAgIGNvbnN0IG9ic2VydmVyQ29uZmlnOiBNdXRhdGlvbk9ic2VydmVySW5pdCA9IHsgY2hpbGRMaXN0OiB0cnVlIH1cbiAgICB0aGlzLnN1Z2dlc3Rpb25Db250YWluZXJPYnNlcnZlci5vYnNlcnZlKG9ic2VydmVyVGFyZ2V0LCBvYnNlcnZlckNvbmZpZyk7XG4gIH1cblxuICAvLyBvbiB1bmxvYWQsIHBlcmZvcm0gdGhlIHNhbWUgc3RlcHMgYXMgZGlzYWJsZVxuICBvbnVubG9hZCgpIHtcbiAgICB0aGlzLmRpc2FibGUoKTtcbiAgfVxuXG4gIC8vIGVuYWJsZSBhbmR5IG1vZGVcbiAgZW5hYmxlID0gKCkgPT4ge1xuICAgIC8vIGFkZCB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ3Jlc2l6ZScsIHRoaXMucmVjYWxjdWxhdGVMZWF2ZXMpO1xuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vbignZmlsZS1vcGVuJywgdGhpcy5oYW5kbGVGaWxlT3Blbik7XG4gICAgdGhpcy5hcHAudmF1bHQub24oJ2RlbGV0ZScsIHRoaXMuaGFuZGxlRGVsZXRlKTtcblxuICAgIC8vIHdhaXQgZm9yIGxheW91dCB0byBiZSByZWFkeSB0byBwZXJmb3JtIHRoZSByZXN0XG4gICAgKHRoaXMuYXBwLndvcmtzcGFjZSBhcyBhbnkpLmxheW91dFJlYWR5ID8gdGhpcy5yZWFsbHlFbmFibGUoKSA6IHRoaXMuYXBwLndvcmtzcGFjZS5vbignbGF5b3V0LXJlYWR5JywgdGhpcy5yZWFsbHlFbmFibGUpO1xuICB9XG5cbiAgLy8gcmVhbGx5IGVuYWJsZSB0aGluZ3MgKG9uY2UgdGhlIGxheW91dCBpcyByZWFkeSlcbiAgcmVhbGx5RW5hYmxlID0gKCkgPT4ge1xuICAgIC8vIHdlIGRvbid0IG5lZWQgdGhlIGV2ZW50IGhhbmRsZXIgYW55bW9yZVxuICAgIHRoaXMuYXBwLndvcmtzcGFjZS5vZmYoJ2xheW91dC1yZWFkeScsIHRoaXMucmVhbGx5RW5hYmxlKTtcblxuICAgIC8vIGJhY2t1cCB0aGUgZnVuY3Rpb24gc28gSSBjYW4gcmVzdG9yZSBpdFxuICAgIHRoaXMucm9vdFNwbGl0QW55Lm9sZE9uQ2hpbGRSZXNpemVTdGFydCA9IHRoaXMucm9vdFNwbGl0QW55Lm9uQ2hpbGRSZXNpemVTdGFydDtcbiAgICB0aGlzLnJvb3RTcGxpdEFueS5vbkNoaWxkUmVzaXplU3RhcnQgPSB0aGlzLm9uQ2hpbGRSZXNpemVTdGFydDtcblxuICAgIC8vIGFkZCBzb21lIGV4dHJhIGNsYXNzZXMgdGhhdCBjYW4ndCBmaXQgaW4gdGhlIHN0eWxlcy5jc3NcbiAgICAvLyBiZWNhdXNlIHRoZXkgdXNlIHNldHRpbmdzXG4gICAgdGhpcy5hZGRTdHlsZSgpO1xuXG4gICAgLy8gZG8gYWxsIHRoZSBjYWx1Y2F0aW9ucyBuZWNlc3NhcnkgZm9yIHRoZSB3b3Jrc3BhY2UgbGVhdmVzXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUxlYXZlcygpO1xuICB9XG5cbiAgLy8gc2h1dCBkb3duIGFuZHkgbW9kZVxuICBkaXNhYmxlID0gKCkgPT4ge1xuXG4gICAgLy8gZ2V0IHJpZCBvZiB0aGUgZXh0cmEgc3R5bGUgdGFnIHdlIGFkZGVkXG4gICAgdGhpcy5yZW1vdmVTdHlsZSgpO1xuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSByb290IGxlYXZlcyB0byByZW1vdmUgdGhlIHN0dWZmIHdlIGFkZGVkXG4gICAgdGhpcy5hcHAud29ya3NwYWNlLml0ZXJhdGVSb290TGVhdmVzKChsZWFmOiBhbnkpID0+IHtcbiAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUud2lkdGggPSBudWxsO1xuICAgICAgbGVhZi5jb250YWluZXJFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcbiAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUucmlnaHQgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgLy8gcmVzdG9yZSB0aGUgZGVmYXVsdCBmdW5jdGlvbmFsaXR5XG4gICAgdGhpcy5yb290U3BsaXRBbnkub25DaGlsZFJlc2l6ZVN0YXJ0ID0gdGhpcy5yb290U3BsaXRBbnkub2xkT25DaGlsZFJlc2l6ZVN0YXJ0O1xuXG4gICAgLy8gZ2V0IHJpZCBvZiBvdXIgZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub2ZmKCdyZXNpemUnLCB0aGlzLnJlY2FsY3VsYXRlTGVhdmVzKTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2Uub2ZmKCdmaWxlLW9wZW4nLCB0aGlzLmhhbmRsZUZpbGVPcGVuKTtcbiAgICB0aGlzLmFwcC52YXVsdC5vZmYoJ2RlbGV0ZScsIHRoaXMuaGFuZGxlRGVsZXRlKTtcbiAgICB0aGlzLnN1Z2dlc3Rpb25Db250YWluZXJPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyByZWZyZXNoIGZ1bmNpb24gZm9yIHdoZW4gd2UgY2hhbmdlIHNldHRpbmdzXG4gIHJlZnJlc2ggPSAoKSA9PiB7XG4gICAgLy8gcmUtbG9hZCB0aGUgc3R5bGVcbiAgICB0aGlzLnVwZGF0ZVN0eWxlKClcbiAgICAvLyByZWNhbGN1bGF0ZSBsZWFmIHBvc2l0aW9uc1xuICAgIHRoaXMucmVjYWxjdWxhdGVMZWF2ZXMoKTtcbiAgfVxuXG4gIC8vIHJlbW92ZSB0aGUgc3RseWluZyBlbGVtZW50cyB3ZSd2ZSBjcmVhdGVkXG4gIHJlbW92ZVN0eWxlID0gKCkgPT4ge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsdWdpbi1zbGlkaW5nLXBhbmVzJyk7XG4gICAgaWYgKGVsKSBlbC5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BsdWdpbi1zbGlkaW5nLXBhbmVzJyk7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwbHVnaW4tc2xpZGluZy1wYW5lcy1yb3RhdGUtaGVhZGVyJyk7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwbHVnaW4tc2xpZGluZy1wYW5lcy1oZWFkZXItYWx0Jyk7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdwbHVnaW4tc2xpZGluZy1wYW5lcy1zdGFja2luZycpO1xuICB9XG5cbiAgLy8gYWRkIHRoZSBzdHlsaW5nIGVsZW1lbnRzIHdlIG5lZWRcbiAgYWRkU3R5bGUgPSAoKSA9PiB7XG4gICAgLy8gYWRkIGEgY3NzIGJsb2NrIGZvciBvdXIgc2V0dGluZ3MtZGVwZW5kZW50IHN0eWxlc1xuICAgIGNvbnN0IGNzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgY3NzLmlkID0gJ3BsdWdpbi1zbGlkaW5nLXBhbmVzJztcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoY3NzKTtcblxuICAgIC8vIGFkZCB0aGUgbWFpbiBjbGFzc1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGx1Z2luLXNsaWRpbmctcGFuZXMnKTtcblxuICAgIC8vIHVwZGF0ZSB0aGUgc3R5bGUgd2l0aCB0aGUgc2V0dGluZ3MtZGVwZW5kZW50IHN0eWxlc1xuICAgIHRoaXMudXBkYXRlU3R5bGUoKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSB0aGUgc3R5bGVzIChhdCB0aGUgc3RhcnQsIG9yIGFzIHRoZSByZXN1bHQgb2YgYSBzZXR0aW5ncyBjaGFuZ2UpXG4gIHVwZGF0ZVN0eWxlID0gKCkgPT4ge1xuICAgIC8vIGlmIHdlJ3ZlIGdvdCByb3RhdGUgaGVhZGVycyBvbiwgYWRkIHRoZSBjbGFzcyB3aGljaCBlbmFibGVzIGl0XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCdwbHVnaW4tc2xpZGluZy1wYW5lcy1yb3RhdGUtaGVhZGVyJywgdGhpcy5zZXR0aW5ncy5yb3RhdGVIZWFkZXJzKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3BsdWdpbi1zbGlkaW5nLXBhbmVzLWhlYWRlci1hbHQnLCB0aGlzLnNldHRpbmdzLmhlYWRlckFsdClcbiAgICAvLyBkbyB0aGUgc2FtZSBmb3Igc3RhY2tpbmdcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3BsdWdpbi1zbGlkaW5nLXBhbmVzLXN0YWNraW5nJywgdGhpcy5zZXR0aW5ncy5zdGFja2luZ0VuYWJsZWQpO1xuICAgIFxuICAgIC8vIGdldCB0aGUgY3VzdG9tIGNzcyBlbGVtZW50XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGx1Z2luLXNsaWRpbmctcGFuZXMnKTtcbiAgICBpZiAoIWVsKSB0aHJvdyBcInBsdWdpbi1zbGlkaW5nLXBhbmVzIGVsZW1lbnQgbm90IGZvdW5kIVwiO1xuICAgIGVsc2Uge1xuICAgICAgLy8gc2V0IHRoZSBzZXR0aW5ncy1kZXBlbmRlbnQgY3NzXG4gICAgICBlbC5pbm5lclRleHQgPSBgXG4gICAgICAgIGJvZHkucGx1Z2luLXNsaWRpbmctcGFuZXN7LS1oZWFkZXItd2lkdGg6JHt0aGlzLnNldHRpbmdzLmhlYWRlcldpZHRofXB4O31cbiAgICAgICAgYm9keS5wbHVnaW4tc2xpZGluZy1wYW5lcyAubW9kLXJvb3Q+LndvcmtzcGFjZS1sZWFme1xuICAgICAgICAgIHdpZHRoOiR7dGhpcy5zZXR0aW5ncy5sZWFmV2lkdGggKyB0aGlzLnNldHRpbmdzLmhlYWRlcldpZHRofXB4O1xuICAgICAgICB9XG4gICAgICBgO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlY2FsY3VsYXRlIHRoZSBsZWFmIHNpemluZyBhbmQgcG9zaXRpb25zXG4gIHJlY2FsY3VsYXRlTGVhdmVzID0gKCkgPT4ge1xuICAgIC8vIHJvb3RTcGxpdC5jaGlsZHJlbiBpcyB1bmRvY3VtZW50ZWQgZm9yIG5vdywgYnV0IGl0J3MgZWFzaWVyIHRvIHVzZSBmb3Igd2hhdCB3ZSdyZSBkb2luZy5cbiAgICBjb25zdCBsZWFmQ291bnQgPSB0aGlzLnJvb3RTcGxpdEFueS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgbGV0IHRvdGFsV2lkdGggPSAwO1xuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGFsbCB0aGUgcm9vdC1sZXZlbCBsZWF2ZXNcbiAgICAvLyBrZWVwIHRoZSBsZWFmIGFzIGBhbnlgIHRvIGdldCB0aGUgdW5kb2N1bWVudGVkIGNvbnRhaW5lckVsXG4gICAgdGhpcy5yb290U3BsaXRBbnkuY2hpbGRyZW4uZm9yRWFjaCgobGVhZjogYW55LCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUubGVmdCA9IHRoaXMuc2V0dGluZ3Muc3RhY2tpbmdFbmFibGVkXG4gICAgICAgID8gKGkgKiB0aGlzLnNldHRpbmdzLmhlYWRlcldpZHRoKSArIFwicHhcIlxuICAgICAgICA6IG51bGw7XG4gICAgICBsZWFmLmNvbnRhaW5lckVsLnN0eWxlLnJpZ2h0ID0gdGhpcy5zZXR0aW5ncy5zdGFja2luZ0VuYWJsZWRcbiAgICAgICAgPyAoKChsZWFmQ291bnQgLSBpIC0gMSkgKiB0aGlzLnNldHRpbmdzLmhlYWRlcldpZHRoKSAtIGxlYWYuY29udGFpbmVyRWwuY2xpZW50V2lkdGgpICsgXCJweFwiXG4gICAgICAgIDogbnVsbDtcbiAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUuZmxleCA9IG51bGw7XG4gICAgICAvLyBrZWVwIHRyYWNrIG9mIHRoZSB0b3RhbCB3aWR0aCBvZiBhbGwgbGVhdmVzXG4gICAgICB0b3RhbFdpZHRoICs9IGxlYWYuY29udGFpbmVyRWwuY2xpZW50V2lkdGg7XG4gICAgfSk7XG5cbiAgICAvLyBpZiB0aGUgdG90YWwgd2lkdGggb2YgYWxsIGxlYXZlcyBpcyBsZXNzIHRoYW4gdGhlIHdpZHRoIGF2YWlsYWJsZSxcbiAgICAvLyBhZGQgYmFjayB0aGUgZmxleCBjbGFzcyBzbyB0aGV5IGZpbGwgdGhlIHNwYWNlXG4gICAgaWYgKHRvdGFsV2lkdGggPCB0aGlzLnJvb3RTcGxpdEFueS5jb250YWluZXJFbC5jbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy5yb290U3BsaXRBbnkuY2hpbGRyZW4uZm9yRWFjaCgobGVhZjogYW55KSA9PiB7XG4gICAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUuZmxleCA9ICcxIDAgMCc7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgbm90IG9ubHkgd2hlbiBhIGZpbGUgb3BlbnMsIGJ1dCB3aGVuIHRoZSBhY3RpdmUgcGFuZSBpcyBzd2l0Y2hlZFxuICBoYW5kbGVGaWxlT3BlbiA9IChlOiBhbnkpOiB2b2lkID0+IHtcbiAgICAvLyBwdXQgYSBzbWFsbCB0aW1lb3V0IG9uIGl0IGJlY2F1c2Ugd2hlbiBhIGZpbGUgaXMgb3BlbmVkIG9uIHRoZSBmYXIgcmlnaHQgXG4gICAgLy8gaXQgd2Fzbid0IGZvY3Vzc2luZyBwcm9wZXJseS4gVGhlIHRpbWVvdXQgZml4ZXMgdGhpc1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gY2hlY2sgZm9yIGEgY2xvc2VkIGxlYWYgYW5kIGFjdGl2YXRlIHRoZSBhZGphY2VudCBsZWFmIGlmIGl0IHdhc1xuICAgICAgdGhpcy5hY3RpdmF0ZUFkamFjZW50TGVhZklmQ2xvc2VkKGUpO1xuICAgICAgLy8gZm9jdXMgb24gdGhlIG5ld2x5IHNlbGVjdGVkIGxlYWZcbiAgICAgIHRoaXMuZm9jdXNMZWFmKGUpXG4gICAgfSwgMTApO1xuICB9O1xuXG4gIC8vIGNoZWNrIGZvciBhIGNsb3NlZCBsZWFmIGFuZCBhY3RpdmF0ZSB0aGUgYWRqYWNlbnQgbGVhZlxuICBhY3RpdmF0ZUFkamFjZW50TGVhZklmQ2xvc2VkID0gKGU6IGFueSk6IHZvaWQgPT4ge1xuICAgIC8vIGZpcnN0IHdlIG5lZWQgdG8gZmlndXJlIG91dCB0aGUgY291bnQgb2Ygb3BlbiBsZWF2ZXNcbiAgICBjb25zdCBsZWFmQ291bnQgPSB0aGlzLnJvb3RTcGxpdEFueS5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAvLyB1c2UgdGhpcyB2YWx1ZSB0byBjaGVjayBpZiB3ZSd2ZSBzZXQgYW4gYWN0aXZlIGxlYWYgeWV0XG4gICAgbGV0IGlzQWN0aXZlTGVhZlNldDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy8gaWYgdGhlIG51bWJlciBvZiBvcGVuIGxlYXZlcyBoYXMgY2hhbmdlZFxuICAgIGlmIChsZWFmQ291bnQgIT0gdGhpcy5sZWF2ZXNPcGVuQ291bnQpIHtcbiAgICAgIC8vIGlmIHRoZSBudW1iZXIgb2YgbGVhdmVzIGlzIDwgb3VyIGxhc3Qgc2F2ZWQgdmFsdWUsIHdlIG11c3QgaGF2ZSBjbG9zZWQgb25lIChvciBtb3JlKVxuICAgICAgaWYgKGxlYWZDb3VudCA8IHRoaXMubGVhdmVzT3BlbkNvdW50KSB7XG4gICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgbGVhdmVzXG4gICAgICAgIHRoaXMucm9vdFNwbGl0QW55LmNoaWxkcmVuLmZvckVhY2goKGxlYWY6IFdvcmtzcGFjZUxlYWYsIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgIC8vIGlmIHdlIGhhdmVuJ3QgYWN0aXZhdGVkIGEgbGVhZiB5ZXQgYW5kIHRoaXMgbGVhZiBpcyBhZGphY2VudCB0byB0aGUgY2xvc2VkIG9uZVxuICAgICAgICAgIGlmICghaXNBY3RpdmVMZWFmU2V0ICYmIChpID49IHRoaXMuYWN0aXZlTGVhZkluZGV4IC0gMSkpIHtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgYWN0aXZlIGxlYWYgKHVuZG9jdW1lbnRlZCwgaGVuY2UgYGFueWApXG4gICAgICAgICAgICAodGhpcy5hcHAud29ya3NwYWNlIGFzIGFueSkuc2V0QWN0aXZlTGVhZihsZWFmKTtcbiAgICAgICAgICAgIGlzQWN0aXZlTGVhZlNldCA9IHRydWU7XG4gICAgICAgICAgICAvLyBzZXQgdGhlIGluZGV4IGZvciBuZXh0IHRpbWUsIGFsc28uXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUxlYWZJbmRleCA9IGk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHRoZSBuZXcgb3BlbiBjb3VudFxuICAgICAgdGhpcy5sZWF2ZXNPcGVuQ291bnQgPSBsZWFmQ291bnQ7XG5cbiAgICAgIC8vIHJlY2FsY3VsYXRlIGxlYWYgcG9zaXRpb25zXG4gICAgICB0aGlzLnJlY2FsY3VsYXRlTGVhdmVzKCk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXNMZWFmID0gKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAvLyBnZXQgYmFjayB0byB0aGUgbGVhZiB3aGljaCBoYXMgYmVlbiBhbmR5J2QgKGBhbnlgIGJlY2F1c2UgcGFyZW50U3BsaXQgaXMgdW5kb2N1bWVudGVkKVxuICAgIGxldCBhY3RpdmVMZWFmOiBhbnkgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICB3aGlsZSAoYWN0aXZlTGVhZiAhPSBudWxsICYmIGFjdGl2ZUxlYWYucGFyZW50U3BsaXQgIT0gbnVsbCAmJiBhY3RpdmVMZWFmLnBhcmVudFNwbGl0ICE9IHRoaXMuYXBwLndvcmtzcGFjZS5yb290U3BsaXQpIHtcbiAgICAgIGFjdGl2ZUxlYWYgPSBhY3RpdmVMZWFmLnBhcmVudFNwbGl0O1xuICAgIH1cbiAgICBcbiAgICBpZiAoYWN0aXZlTGVhZiAhPSBudWxsKSB7XG4gICAgICAvLyBnZXQgdGhlIGluZGV4IG9mIHRoZSBhY3RpdmUgbGVhZlxuICAgICAgLy8gYWxzbywgZ2V0IHRoZSBwb3NpdGlvbiBvZiB0aGlzIGxlYWYsIHNvIHdlIGNhbiBzY3JvbGwgdG8gaXRcbiAgICAgIC8vIGFzIGxlYXZlcyBhcmUgcmVzaXphYmxlLCB3ZSBoYXZlIHRvIGl0ZXJhdGUgdGhyb3VnaCBhbGwgbGVhdmVzIHRvIHRoZVxuICAgICAgLy8gbGVmdCB1bnRpbCB3ZSBnZXQgdG8gdGhlIGFjdGl2ZSBvbmUgYW5kIGFkZCBhbGwgdGhlaXIgd2lkdGhzIHRvZ2V0aGVyXG4gICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgdGhpcy5hY3RpdmVMZWFmSW5kZXggPSAtMTtcbiAgICAgIHRoaXMucm9vdFNwbGl0QW55LmNoaWxkcmVuLmZvckVhY2goKGxlYWY6IGFueSwgaW5kZXg6bnVtYmVyKSA9PiB7XG4gICAgICAgIC8vIHRoaXMgaXMgdGhlIGFjdGl2ZSBvbmVcbiAgICAgICAgaWYgKGxlYWYgPT0gYWN0aXZlTGVhZikge1xuICAgICAgICAgIHRoaXMuYWN0aXZlTGVhZkluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgbGVhZi5jb250YWluZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2QtYW0tbGVmdC1vZi1hY3RpdmUnKTtcbiAgICAgICAgICBsZWFmLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZC1hbS1yaWdodC1vZi1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHRoaXMuYWN0aXZlTGVhZkluZGV4ID09IC0xIHx8IGluZGV4IDwgdGhpcy5hY3RpdmVMZWFmSW5kZXgpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIGJlZm9yZSB0aGUgYWN0aXZlIG9uZSwgYWRkIHRoZSB3aWR0aFxuICAgICAgICAgIHBvc2l0aW9uICs9IGxlYWYuY29udGFpbmVyRWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgbGVhZi5jb250YWluZXJFbC5jbGFzc0xpc3QuYWRkKCdtb2QtYW0tbGVmdC1vZi1hY3RpdmUnKTtcbiAgICAgICAgICBsZWFmLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5yZW1vdmUoJ21vZC1hbS1yaWdodC1vZi1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHJpZ2h0IG9mIHRoZSBhY3RpdmUgb25lXG4gICAgICAgICAgbGVhZi5jb250YWluZXJFbC5jbGFzc0xpc3QucmVtb3ZlKCdtb2QtYW0tbGVmdC1vZi1hY3RpdmUnKTtcbiAgICAgICAgICBsZWFmLmNvbnRhaW5lckVsLmNsYXNzTGlzdC5hZGQoJ21vZC1hbS1yaWdodC1vZi1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vIGdldCB0aGUgdG90YWwgbGVhZiBjb3VudFxuICAgICAgY29uc3QgbGVhZkNvdW50ID0gdGhpcy5yb290U3BsaXRBbnkuY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgLy8gZ2V0IHRoaXMgbGVhZidzIGxlZnQgdmFsdWUgKHRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gdGhlIGxlZnQgZm9yIHN0aWNreSBoZWFkZXJzKVxuICAgICAgY29uc3QgbGVmdCA9IHBhcnNlSW50KGFjdGl2ZUxlYWYuY29udGFpbmVyRWwuc3R5bGUubGVmdCkgfHwgMDtcbiAgICAgIC8vIHRoZSBhbW91bnQgb2Ygc3BhY2UgdG8gdGhlIHJpZ2h0IHdlIG5lZWQgdG8gbGVhdmUgZm9yIHN0aWNreSBoZWFkZXJzXG4gICAgICBjb25zdCBoZWFkZXJzVG9SaWdodFdpZHRoID0gdGhpcy5zZXR0aW5ncy5zdGFja2luZ0VuYWJsZWQgPyAobGVhZkNvdW50IC0gdGhpcy5hY3RpdmVMZWFmSW5kZXggLSAyKSAqIHRoaXMuc2V0dGluZ3MuaGVhZGVyV2lkdGggOiAwO1xuICAgICAgLy8gdGhlIHJvb3QgZWxlbWVudCB3ZSBuZWVkIHRvIHNjcm9sbFxuICAgICAgY29uc3Qgcm9vdEVsID0gdGhpcy5yb290U3BsaXRBbnkuY29udGFpbmVyRWw7XG4gICAgICBcbiAgICAgIC8vIGl0J3MgdG9vIGZhciBsZWZ0XG4gICAgICBpZiAocm9vdEVsLnNjcm9sbExlZnQgPiBwb3NpdGlvbiAtIGxlZnQpIHtcbiAgICAgICAgLy8gc2Nyb2xsIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIHBhbmUgaW50byB2aWV3XG4gICAgICAgIHJvb3RFbC5zY3JvbGxUbyh7IGxlZnQ6IHBvc2l0aW9uIC0gbGVmdCwgdG9wOiAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSk7XG4gICAgICB9XG4gICAgICAvLyBpdCdzIHRvbyBmYXIgcmlnaHRcbiAgICAgIGVsc2UgaWYgKHJvb3RFbC5zY3JvbGxMZWZ0ICsgcm9vdEVsLmNsaWVudFdpZHRoIDwgcG9zaXRpb24gKyBhY3RpdmVMZWFmLmNvbnRhaW5lckVsLmNsaWVudFdpZHRoICsgaGVhZGVyc1RvUmlnaHRXaWR0aCkge1xuICAgICAgICAvLyBzY3JvbGwgdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIHBhbmUgaW50byB2aWV3XG4gICAgICAgIHJvb3RFbC5zY3JvbGxUbyh7IGxlZnQ6IHBvc2l0aW9uICsgYWN0aXZlTGVhZi5jb250YWluZXJFbC5jbGllbnRXaWR0aCArIGhlYWRlcnNUb1JpZ2h0V2lkdGggLSByb290RWwuY2xpZW50V2lkdGgsIHRvcDogMCwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGhhbmRlIHdoZW4gYSBmaWxlIGlzIGRlbGV0ZWRcbiAgaGFuZGxlRGVsZXRlID0gKGZpbGU6IFRBYnN0cmFjdEZpbGUpID0+IHtcbiAgICAvLyBjbG9zZSBhbnkgbGVhdmVzIHdpdGggdGhlIGRlbGV0ZWQgZmlsZSBvcGVuXG4gICAgLy8gZGV0YWNoaW5nIGEgbGVhZiB3aGlsZSBpdGVyYXRpbmcgbWVzc2VzIHdpdGggdGhlIGl0ZXJhdGlvblxuICAgIGNvbnN0IGxlYXZlc1RvRGV0YWNoOiBXb3Jrc3BhY2VMZWFmW10gPSBbXTtcbiAgICB0aGlzLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZVJvb3RMZWF2ZXMoKGxlYWY6IFdvcmtzcGFjZUxlYWYpID0+IHtcbiAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBGaWxlVmlldyAmJiBsZWFmLnZpZXcuZmlsZSA9PSBmaWxlKSB7XG4gICAgICAgIGxlYXZlc1RvRGV0YWNoLnB1c2gobGVhZik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbGVhdmVzVG9EZXRhY2guZm9yRWFjaChsZWFmID0+IGxlYWYuZGV0YWNoKCkpO1xuICB9O1xuXG4gIHBvc2l0aW9uU3VnZ2VzdGlvbkNvbnRhaW5lciA9IChzY05vZGU6IGFueSk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGNtRWRpdG9yID0gKHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXcgYXMgYW55KS5zb3VyY2VNb2RlLmNtRWRpdG9yIGFzIEVkaXRvcjtcblxuICAgIC8vIGZpbmQgdGhlIG9wZW4gYnJhY2tldCB0byB0aGUgbGVmdCBvZiBvciBhdCB0aGUgY3Vyc29yXG5cbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IGNtRWRpdG9yLmdldEN1cnNvcigpO1xuICAgIHZhciBjdXJyZW50VG9rZW4gPSBjbUVkaXRvci5nZXRUb2tlbkF0KGNtRWRpdG9yLmdldEN1cnNvcigpKTtcblxuICAgIGxldCBjdXJyZW50TGlua1Bvc2l0aW9uOiBQb3NpdGlvbjtcblxuICAgIGlmIChjdXJyZW50VG9rZW4uc3RyaW5nID09PSAnW10nKSB7IC8vIHRoZXJlIGlzIG5vIHRleHQgd2l0aGluIHRoZSBkb3VibGUgYnJhY2tldHMgeWV0XG4gICAgICBjdXJyZW50TGlua1Bvc2l0aW9uID0gY3Vyc29yUG9zaXRpb247XG4gICAgfSBlbHNlIHsgLy8gdGhlcmUgaXMgdGV4dCB3aXRoaW4gdGhlIGRvdWJsZSBicmFja2V0c1xuICAgICAgdmFyIGxpbmVUb2tlbnMgPSBjbUVkaXRvci5nZXRMaW5lVG9rZW5zKGN1cnNvclBvc2l0aW9uLmxpbmUpO1xuICAgICAgdmFyIHByZXZpb3VzVG9rZW5zID0gbGluZVRva2Vucy5maWx0ZXIoKHRva2VuOiBUb2tlbik6IGJvb2xlYW4gPT4gdG9rZW4uc3RhcnQgPD0gY3VycmVudFRva2VuLnN0YXJ0KS5yZXZlcnNlKCk7XG4gICAgICBjb25zdCBvcGVuQnJhY2tldHNUb2tlbiA9IHByZXZpb3VzVG9rZW5zLmZpbmQoKHRva2VuOiBUb2tlbik6IGJvb2xlYW4gPT4gdG9rZW4uc3RyaW5nLmNvbnRhaW5zKCdbJykpO1xuXG4gICAgICAvLyBwb3NpdGlvbiB0aGUgc3VnZ2VzdGlvbiBjb250YWluZXIgdG8ganVzdCB1bmRlcm5lYXRoIHRoZSBlbmQgb2YgdGhlIG9wZW4gYnJhY2tldHNcbiAgICAgIGN1cnJlbnRMaW5rUG9zaXRpb24gPSB7IGxpbmU6IGN1cnNvclBvc2l0aW9uLmxpbmUsIGNoOiBvcGVuQnJhY2tldHNUb2tlbi5lbmQgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzY0Nvb3JkcyA9IGNtRWRpdG9yLmNoYXJDb29yZHMoY3VycmVudExpbmtQb3NpdGlvbik7XG5cbiAgICAvLyBtYWtlIHN1cmUgaXQgZml0cyB3aXRoaW4gdGhlIHdpbmRvd1xuXG4gICAgY29uc3QgYXBwQ29udGFpbmVyRWwgPSAodGhpcy5hcHAgYXMgYW55KS5kb20uYXBwQ29udGFpbmVyRWxcblxuICAgIGNvbnN0IHNjUmlnaHQgPSBzY0Nvb3Jkcy5sZWZ0ICsgc2NOb2RlLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGFwcFdpZHRoID0gYXBwQ29udGFpbmVyRWwub2Zmc2V0V2lkdGg7XG4gICAgaWYgKHNjUmlnaHQgPiBhcHBXaWR0aCkge1xuICAgICAgc2NDb29yZHMubGVmdCAtPSBzY1JpZ2h0IC0gYXBwV2lkdGg7XG4gICAgfVxuXG4gICAgLy8gc2V0IHRoZSBsZWZ0IGNvb3JkXG4gICAgLy8gdGhlIHRvcCBjb29yZCBpcyBzZXQgYnkgT2JzaWRpYW4gYW5kIGlzIGNvcnJlY3QuXG4gICAgLy8gaXQncyBhbHNvIGEgcGFpbiB0byB0cnkgdG8gcmVjYWxjdWxhdGUgc28gSSBsZWZ0IGl0IG91dC5cblxuICAgIHNjTm9kZS5zdHlsZS5sZWZ0ID0gTWF0aC5tYXgoc2NDb29yZHMubGVmdCwgMCkgKyAncHgnO1xuICB9O1xuXG4gIC8vIG92ZXJyaWRlbiBmdW5jdGlvbiBmb3Igcm9vdFNwbGl0IGNoaWxkIHJlc2l6ZVxuICBvbkNoaWxkUmVzaXplU3RhcnQgPSAobGVhZjogYW55LCBldmVudDogYW55KSA9PiB7XG5cbiAgICAvLyBvbmx5IHJlYWxseSBhcHBseSB0aGlzIHRvIHZlcnRpY2FsIHNwbGl0c1xuICAgIGlmICh0aGlzLnJvb3RTcGxpdEFueS5kaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgLy8gdGhpcyBpcyB0aGUgd2lkdGggdGhlIGxlYWYgc3RhcnRlZCBhdCBiZWZvcmUgcmVzaXplXG4gICAgICBjb25zdCBzdGFydFdpZHRoID0gbGVhZi5jb250YWluZXJFbC5jbGllbnRXaWR0aDtcblxuICAgICAgLy8gdGhlIG1vdXNlbW92ZSBldmVudCB0byB0cmlnZ2VyIHdoaWxlIHJlc2l6aW5nXG4gICAgICBjb25zdCBtb3VzZW1vdmUgPSAoZTogYW55KSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBmaXJzdCBwb3NpdGlvbiBhbmQgY3VycmVudFxuICAgICAgICBjb25zdCBkZWx0YVggPSBlLnBhZ2VYIC0gZXZlbnQucGFnZVg7XG4gICAgICAgIC8vIGFkanVzdCB0aGUgc3RhcnQgd2lkdGggYnkgdGhlIGRlbHRhXG4gICAgICAgIGxlYWYuY29udGFpbmVyRWwuc3R5bGUud2lkdGggPSBgJHtzdGFydFdpZHRoICsgZGVsdGFYfXB4YDtcbiAgICAgIH1cblxuICAgICAgLy8gdGhlIG1vdXNldXAgZXZlbnQgdG8gdHJpZ2dlciBhdCB0aGUgZW5kIG9mIHJlc2l6aW5nXG4gICAgICBjb25zdCBtb3VzZXVwID0gKCkgPT4ge1xuICAgICAgICAvLyBpZiBzdGFja2luZyBpcyBlbmFibGVkLCB3ZSBuZWVkIHRvIHJlLWppZyB0aGUgXCJyaWdodFwiIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnN0YWNraW5nRW5hYmxlZCkge1xuICAgICAgICAgIC8vIHdlIG5lZWQgdGhlIGxlYWYgY291bnQgYW5kIGluZGV4IHRvIGNhbGN1bGF0ZSB0aGUgY29ycmVjdCB2YWx1ZVxuICAgICAgICAgIGNvbnN0IGxlYWZDb3VudCA9IHRoaXMucm9vdFNwbGl0QW55LmNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCBsZWFmSW5kZXggPSB0aGlzLnJvb3RTcGxpdEFueS5jaGlsZHJlbi5maW5kSW5kZXgoKGw6IGFueSkgPT4gbCA9PSBsZWFmKTtcbiAgICAgICAgICBsZWFmLmNvbnRhaW5lckVsLnN0eWxlLnJpZ2h0ID0gKCgobGVhZkNvdW50IC0gbGVhZkluZGV4IC0gMSkgKiB0aGlzLnNldHRpbmdzLmhlYWRlcldpZHRoKSAtIGxlYWYuY29udGFpbmVyRWwuY2xpZW50V2lkdGgpICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZXNlIGV2ZW50IGxpc3RlbmVycy4gV2UncmUgZG9uZSB3aXRoIHRoZW1cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZW1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBhYm92ZSB0d28gZXZlbnQgbGlzdGVuZXJzXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdXNlbW92ZSk7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZXVwKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU2xpZGluZ1BhbmVzU2V0dGluZ3Mge1xuICBoZWFkZXJXaWR0aDogbnVtYmVyID0gMzI7XG4gIGxlYWZXaWR0aDogbnVtYmVyID0gNzAwO1xuICBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICByb3RhdGVIZWFkZXJzOiBib29sZWFuID0gdHJ1ZTtcbiAgaGVhZGVyQWx0OiBib29sZWFuID0gZmFsc2U7XG4gIHN0YWNraW5nRW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG59XG5cbmNsYXNzIFNsaWRpbmdQYW5lc1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcblxuICBwbHVnaW46IFNsaWRpbmdQYW5lc1BsdWdpbjtcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogU2xpZGluZ1BhbmVzUGx1Z2luKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9nZ2xlIFNsaWRpbmcgUGFuZXNcIilcbiAgICAgIC5zZXREZXNjKFwiVHVybnMgc2xpZGluZyBwYW5lcyBvbiBvciBvZmYgZ2xvYmFsbHlcIilcbiAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZSghdGhpcy5wbHVnaW4uc2V0dGluZ3MuZGlzYWJsZWQpXG4gICAgICAgIC5vbkNoYW5nZSgodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5kaXNhYmxlZCA9ICF2YWx1ZTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgaWYgKHRoaXMucGx1Z2luLnNldHRpbmdzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5kaXNhYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW4uZW5hYmxlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnTGVhZiBXaWR0aCcpXG4gICAgICAuc2V0RGVzYygnVGhlIHdpZHRoIG9mIGEgc2luZ2xlIHBhbmUnKVxuICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0LnNldFBsYWNlaG9sZGVyKCdFeGFtcGxlOiA3MDAnKVxuICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLmxlYWZXaWR0aCB8fCAnJykgKyAnJylcbiAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmxlYWZXaWR0aCA9IHBhcnNlSW50KHZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIlRvZ2dsZSByb3RhdGVkIGhlYWRlcnNcIilcbiAgICAgIC5zZXREZXNjKFwiUm90YXRlcyBoZWFkZXJzIHRvIHVzZSBhcyBzcGluZXNcIilcbiAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5yb3RhdGVIZWFkZXJzKVxuICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Mucm90YXRlSGVhZGVycyA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJTd2FwIHJvdGF0ZWQgaGVhZGVyIGRpcmVjdGlvblwiKVxuICAgICAgLnNldERlc2MoXCJTd2FwcyB0aGUgZGlyZWN0aW9uIG9mIHJvdGF0ZWQgaGVhZGVyc1wiKVxuICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRlckFsdClcbiAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRlckFsdCA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pKTtcbiAgICBcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiVG9nZ2xlIHN0YWNraW5nXCIpXG4gICAgICAuc2V0RGVzYyhcIlBhbmVzIHdpbGwgc3RhY2sgdXAgdG8gdGhlIGxlZnQgYW5kIHJpZ2h0XCIpXG4gICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB0b2dnbGUuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhY2tpbmdFbmFibGVkKVxuICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3Muc3RhY2tpbmdFbmFibGVkID0gdmFsdWU7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2goKTtcbiAgICAgICAgfSkpO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZSgnU3BpbmUgV2lkdGgnKVxuICAgICAgLnNldERlc2MoJ1RoZSB3aWR0aCBvZiB0aGUgcm90YXRlZCBoZWFkZXIgKG9yIGdhcCkgZm9yIHN0YWNraW5nJylcbiAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dC5zZXRQbGFjZWhvbGRlcignRXhhbXBsZTogMzInKVxuICAgICAgICAuc2V0VmFsdWUoKHRoaXMucGx1Z2luLnNldHRpbmdzLmhlYWRlcldpZHRoIHx8ICcnKSArICcnKVxuICAgICAgICAub25DaGFuZ2UoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuaGVhZGVyV2lkdGggPSBwYXJzZUludCh2YWx1ZS50cmltKCkpO1xuICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICB0aGlzLnBsdWdpbi5yZWZyZXNoKCk7XG4gICAgICAgIH0pKTtcblxuICB9XG59XG4iXSwibmFtZXMiOlsiRmlsZVZpZXciLCJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUcsb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVB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

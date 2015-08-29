exports.__esModule = true;
exports.RenderState = RenderState;
exports.blockFor = blockFor;
exports.renderAndCleanup = renderAndCleanup;
exports.clearMorph = clearMorph;
exports.clearMorphList = clearMorphList;

var _htmlbarsUtilMorphUtils = require("../htmlbars-util/morph-utils");

function RenderState(renderNode, morphList) {
  // The morph list that is no longer needed and can be
  // destroyed.
  this.morphListToClear = morphList;

  // The morph list that needs to be pruned of any items
  // that were not yielded on a subsequent render.
  this.morphListToPrune = null;

  // A map of morphs for each item yielded in during this
  // rendering pass. Any morphs in the DOM but not in this map
  // will be pruned during cleanup.
  this.handledMorphs = {};
  this.collisions = undefined;

  // The morph to clear once rendering is complete. By
  // default, we set this to the previous morph (to catch
  // the case where nothing is yielded; in that case, we
  // should just clear the morph). Otherwise this gets set
  // to null if anything is rendered.
  this.morphToClear = renderNode;

  this.shadowOptions = null;
}

function Block(render, template, blockOptions) {
  this.render = render;
  this.template = template;
  this.blockOptions = blockOptions;
  this.arity = template.arity;
}

Block.prototype.invoke = function (env, blockArguments, self, renderNode, parentScope, visitor) {
  var _this = this;

  if (renderNode.lastResult) {
    renderNode.lastResult.revalidateWith(env, undefined, self, blockArguments, visitor);
  } else {
    (function () {
      var options = { renderState: new RenderState(renderNode) };
      var render = _this.render;
      var template = _this.template;
      var scope = _this.blockOptions.scope;

      var shadowScope = scope ? env.hooks.createChildScope(scope) : env.hooks.createFreshScope();

      env.hooks.bindShadowScope(env, parentScope, shadowScope, _this.blockOptions.options);

      if (self !== undefined) {
        env.hooks.bindSelf(env, shadowScope, self);
      } else if (_this.blockOptions.self !== undefined) {
        env.hooks.bindSelf(env, shadowScope, _this.blockOptions.self);
      }

      bindBlocks(env, shadowScope, _this.blockOptions.yieldTo);

      renderAndCleanup(renderNode, env, options, null, function () {
        options.renderState.morphToClear = null;
        render(template, env, shadowScope, { renderNode: renderNode, blockArguments: blockArguments });
      });
    })();
  }
};

function blockFor(render, template, blockOptions) {
  return new Block(render, template, blockOptions);
}

function bindBlocks(env, shadowScope, blocks) {
  if (!blocks) {
    return;
  }
  if (blocks instanceof Block) {
    env.hooks.bindBlock(env, shadowScope, blocks);
  } else {
    for (var name in blocks) {
      if (blocks.hasOwnProperty(name)) {
        env.hooks.bindBlock(env, shadowScope, blocks[name], name);
      }
    }
  }
}

function renderAndCleanup(morph, env, options, shadowOptions, callback) {
  // The RenderState object is used to collect information about what the
  // helper or hook being invoked has yielded. Once it has finished either
  // yielding multiple items (via yieldItem) or a single template (via
  // yieldTemplate), we detect what was rendered and how it differs from
  // the previous render, cleaning up old state in DOM as appropriate.
  var renderState = options.renderState;
  renderState.collisions = undefined;
  renderState.shadowOptions = shadowOptions;

  // Invoke the callback, instructing it to save information about what it
  // renders into RenderState.
  var result = callback(options);

  // The hook can opt-out of cleanup if it handled cleanup itself.
  if (result && result.handled) {
    return;
  }

  var morphMap = morph.morphMap;

  // Walk the morph list, clearing any items that were yielded in a previous
  // render but were not yielded during this render.
  var morphList = renderState.morphListToPrune;
  if (morphList) {
    var handledMorphs = renderState.handledMorphs;
    var item = morphList.firstChildMorph;

    while (item) {
      var next = item.nextMorph;

      // If we don't see the key in handledMorphs, it wasn't
      // yielded in and we can safely remove it from DOM.
      if (!(item.key in handledMorphs)) {
        delete morphMap[item.key];
        clearMorph(item, env, true);
        item.destroy();
      }

      item = next;
    }
  }

  morphList = renderState.morphListToClear;
  if (morphList) {
    clearMorphList(morphList, morph, env);
  }

  var toClear = renderState.morphToClear;
  if (toClear) {
    clearMorph(toClear, env);
  }
}

function clearMorph(morph, env, destroySelf) {
  var cleanup = env.hooks.cleanupRenderNode;
  var destroy = env.hooks.destroyRenderNode;
  var willCleanup = env.hooks.willCleanupTree;
  var didCleanup = env.hooks.didCleanupTree;

  function destroyNode(node) {
    if (cleanup) {
      cleanup(node);
    }
    if (destroy) {
      destroy(node);
    }
  }

  if (willCleanup) {
    willCleanup(env, morph, destroySelf);
  }
  if (cleanup) {
    cleanup(morph);
  }
  if (destroySelf && destroy) {
    destroy(morph);
  }

  _htmlbarsUtilMorphUtils.visitChildren(morph.childNodes, destroyNode);

  // TODO: Deal with logical children that are not in the DOM tree
  morph.clear();
  if (didCleanup) {
    didCleanup(env, morph, destroySelf);
  }

  morph.lastResult = null;
  morph.lastYielded = null;
  morph.childNodes = null;
}

function clearMorphList(morphList, morph, env) {
  var item = morphList.firstChildMorph;

  while (item) {
    var next = item.nextMorph;
    delete morph.morphMap[item.key];
    clearMorph(item, env, true);
    item.destroy();

    item = next;
  }

  // Remove the MorphList from the morph.
  morphList.clear();
  morph.morphList = null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0bWxiYXJzLXV0aWwvdGVtcGxhdGUtdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztzQ0FBOEIsOEJBQThCOztBQUVyRCxTQUFTLFdBQVcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFOzs7QUFHakQsTUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQzs7OztBQUlsQyxNQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOzs7OztBQUs3QixNQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN4QixNQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7Ozs7OztBQU81QixNQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQzs7QUFFL0IsTUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Q0FDM0I7O0FBRUQsU0FBUyxLQUFLLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUU7QUFDN0MsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsTUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsTUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7QUFDakMsTUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0NBQzdCOztBQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVMsR0FBRyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUU7OztBQUM3RixNQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUU7QUFDekIsY0FBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3JGLE1BQU07O0FBQ0wsVUFBSSxPQUFPLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUUs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QUFFLENBQUM7QUFDbEIsT0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Q0FDeEIiLCJmaWxlIjoiaHRtbGJhcnMtdXRpbC90ZW1wbGF0ZS11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZpc2l0Q2hpbGRyZW4gfSBmcm9tIFwiLi4vaHRtbGJhcnMtdXRpbC9tb3JwaC11dGlsc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVuZGVyU3RhdGUocmVuZGVyTm9kZSwgbW9ycGhMaXN0KSB7XG4gIC8vIFRoZSBtb3JwaCBsaXN0IHRoYXQgaXMgbm8gbG9uZ2VyIG5lZWRlZCBhbmQgY2FuIGJlXG4gIC8vIGRlc3Ryb3llZC5cbiAgdGhpcy5tb3JwaExpc3RUb0NsZWFyID0gbW9ycGhMaXN0O1xuXG4gIC8vIFRoZSBtb3JwaCBsaXN0IHRoYXQgbmVlZHMgdG8gYmUgcHJ1bmVkIG9mIGFueSBpdGVtc1xuICAvLyB0aGF0IHdlcmUgbm90IHlpZWxkZWQgb24gYSBzdWJzZXF1ZW50IHJlbmRlci5cbiAgdGhpcy5tb3JwaExpc3RUb1BydW5lID0gbnVsbDtcblxuICAvLyBBIG1hcCBvZiBtb3JwaHMgZm9yIGVhY2ggaXRlbSB5aWVsZGVkIGluIGR1cmluZyB0aGlzXG4gIC8vIHJlbmRlcmluZyBwYXNzLiBBbnkgbW9ycGhzIGluIHRoZSBET00gYnV0IG5vdCBpbiB0aGlzIG1hcFxuICAvLyB3aWxsIGJlIHBydW5lZCBkdXJpbmcgY2xlYW51cC5cbiAgdGhpcy5oYW5kbGVkTW9ycGhzID0ge307XG4gIHRoaXMuY29sbGlzaW9ucyA9IHVuZGVmaW5lZDtcblxuICAvLyBUaGUgbW9ycGggdG8gY2xlYXIgb25jZSByZW5kZXJpbmcgaXMgY29tcGxldGUuIEJ5XG4gIC8vIGRlZmF1bHQsIHdlIHNldCB0aGlzIHRvIHRoZSBwcmV2aW91cyBtb3JwaCAodG8gY2F0Y2hcbiAgLy8gdGhlIGNhc2Ugd2hlcmUgbm90aGluZyBpcyB5aWVsZGVkOyBpbiB0aGF0IGNhc2UsIHdlXG4gIC8vIHNob3VsZCBqdXN0IGNsZWFyIHRoZSBtb3JwaCkuIE90aGVyd2lzZSB0aGlzIGdldHMgc2V0XG4gIC8vIHRvIG51bGwgaWYgYW55dGhpbmcgaXMgcmVuZGVyZWQuXG4gIHRoaXMubW9ycGhUb0NsZWFyID0gcmVuZGVyTm9kZTtcblxuICB0aGlzLnNoYWRvd09wdGlvbnMgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBCbG9jayhyZW5kZXIsIHRlbXBsYXRlLCBibG9ja09wdGlvbnMpIHtcbiAgdGhpcy5yZW5kZXIgPSByZW5kZXI7XG4gIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgdGhpcy5ibG9ja09wdGlvbnMgPSBibG9ja09wdGlvbnM7XG4gIHRoaXMuYXJpdHkgPSB0ZW1wbGF0ZS5hcml0eTtcbn1cblxuQmxvY2sucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uKGVudiwgYmxvY2tBcmd1bWVudHMsIHNlbGYsIHJlbmRlck5vZGUsIHBhcmVudFNjb3BlLCB2aXNpdG9yKSB7XG4gIGlmIChyZW5kZXJOb2RlLmxhc3RSZXN1bHQpIHtcbiAgICByZW5kZXJOb2RlLmxhc3RSZXN1bHQucmV2YWxpZGF0ZVdpdGgoZW52LCB1bmRlZmluZWQsIHNlbGYsIGJsb2NrQXJndW1lbnRzLCB2aXNpdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgb3B0aW9ucyA9IHsgcmVuZGVyU3RhdGU6IG5ldyBSZW5kZXJTdGF0ZShyZW5kZXJOb2RlKSB9O1xuICAgIGxldCB7IHJlbmRlciwgdGVtcGxhdGUsIGJsb2NrT3B0aW9uczogeyBzY29wZSB9IH0gPSB0aGlzO1xuICAgIGxldCBzaGFkb3dTY29wZSA9IHNjb3BlID8gZW52Lmhvb2tzLmNyZWF0ZUNoaWxkU2NvcGUoc2NvcGUpIDogZW52Lmhvb2tzLmNyZWF0ZUZyZXNoU2NvcGUoKTtcblxuICAgIGVudi5ob29rcy5iaW5kU2hhZG93U2NvcGUoZW52LCBwYXJlbnRTY29wZSwgc2hhZG93U2NvcGUsIHRoaXMuYmxvY2tPcHRpb25zLm9wdGlvbnMpO1xuXG4gICAgaWYgKHNlbGYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZW52Lmhvb2tzLmJpbmRTZWxmKGVudiwgc2hhZG93U2NvcGUsIHNlbGYpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ibG9ja09wdGlvbnMuc2VsZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbnYuaG9va3MuYmluZFNlbGYoZW52LCBzaGFkb3dTY29wZSwgdGhpcy5ibG9ja09wdGlvbnMuc2VsZik7XG4gICAgfVxuXG4gICAgYmluZEJsb2NrcyhlbnYsIHNoYWRvd1Njb3BlLCB0aGlzLmJsb2NrT3B0aW9ucy55aWVsZFRvKTtcblxuICAgIHJlbmRlckFuZENsZWFudXAocmVuZGVyTm9kZSwgZW52LCBvcHRpb25zLCBudWxsLCBmdW5jdGlvbigpIHtcbiAgICAgIG9wdGlvbnMucmVuZGVyU3RhdGUubW9ycGhUb0NsZWFyID0gbnVsbDtcbiAgICAgIHJlbmRlcih0ZW1wbGF0ZSwgZW52LCBzaGFkb3dTY29wZSwgeyByZW5kZXJOb2RlLCBibG9ja0FyZ3VtZW50cyB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrRm9yKHJlbmRlciwgdGVtcGxhdGUsIGJsb2NrT3B0aW9ucykge1xuICByZXR1cm4gbmV3IEJsb2NrKHJlbmRlciwgdGVtcGxhdGUsIGJsb2NrT3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGJpbmRCbG9ja3MoZW52LCBzaGFkb3dTY29wZSwgYmxvY2tzKSB7XG4gIGlmICghYmxvY2tzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChibG9ja3MgaW5zdGFuY2VvZiBCbG9jaykge1xuICAgIGVudi5ob29rcy5iaW5kQmxvY2soZW52LCBzaGFkb3dTY29wZSwgYmxvY2tzKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIGJsb2Nrcykge1xuICAgICAgaWYgKGJsb2Nrcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICBlbnYuaG9va3MuYmluZEJsb2NrKGVudiwgc2hhZG93U2NvcGUsIGJsb2Nrc1tuYW1lXSwgbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJBbmRDbGVhbnVwKG1vcnBoLCBlbnYsIG9wdGlvbnMsIHNoYWRvd09wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIC8vIFRoZSBSZW5kZXJTdGF0ZSBvYmplY3QgaXMgdXNlZCB0byBjb2xsZWN0IGluZm9ybWF0aW9uIGFib3V0IHdoYXQgdGhlXG4gIC8vIGhlbHBlciBvciBob29rIGJlaW5nIGludm9rZWQgaGFzIHlpZWxkZWQuIE9uY2UgaXQgaGFzIGZpbmlzaGVkIGVpdGhlclxuICAvLyB5aWVsZGluZyBtdWx0aXBsZSBpdGVtcyAodmlhIHlpZWxkSXRlbSkgb3IgYSBzaW5nbGUgdGVtcGxhdGUgKHZpYVxuICAvLyB5aWVsZFRlbXBsYXRlKSwgd2UgZGV0ZWN0IHdoYXQgd2FzIHJlbmRlcmVkIGFuZCBob3cgaXQgZGlmZmVycyBmcm9tXG4gIC8vIHRoZSBwcmV2aW91cyByZW5kZXIsIGNsZWFuaW5nIHVwIG9sZCBzdGF0ZSBpbiBET00gYXMgYXBwcm9wcmlhdGUuXG4gIHZhciByZW5kZXJTdGF0ZSA9IG9wdGlvbnMucmVuZGVyU3RhdGU7XG4gIHJlbmRlclN0YXRlLmNvbGxpc2lvbnMgPSB1bmRlZmluZWQ7XG4gIHJlbmRlclN0YXRlLnNoYWRvd09wdGlvbnMgPSBzaGFkb3dPcHRpb25zO1xuXG4gIC8vIEludm9rZSB0aGUgY2FsbGJhY2ssIGluc3RydWN0aW5nIGl0IHRvIHNhdmUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBpdFxuICAvLyByZW5kZXJzIGludG8gUmVuZGVyU3RhdGUuXG4gIHZhciByZXN1bHQgPSBjYWxsYmFjayhvcHRpb25zKTtcblxuICAvLyBUaGUgaG9vayBjYW4gb3B0LW91dCBvZiBjbGVhbnVwIGlmIGl0IGhhbmRsZWQgY2xlYW51cCBpdHNlbGYuXG4gIGlmIChyZXN1bHQgJiYgcmVzdWx0LmhhbmRsZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbW9ycGhNYXAgPSBtb3JwaC5tb3JwaE1hcDtcblxuICAvLyBXYWxrIHRoZSBtb3JwaCBsaXN0LCBjbGVhcmluZyBhbnkgaXRlbXMgdGhhdCB3ZXJlIHlpZWxkZWQgaW4gYSBwcmV2aW91c1xuICAvLyByZW5kZXIgYnV0IHdlcmUgbm90IHlpZWxkZWQgZHVyaW5nIHRoaXMgcmVuZGVyLlxuICBsZXQgbW9ycGhMaXN0ID0gcmVuZGVyU3RhdGUubW9ycGhMaXN0VG9QcnVuZTtcbiAgaWYgKG1vcnBoTGlzdCkge1xuICAgIGxldCBoYW5kbGVkTW9ycGhzID0gcmVuZGVyU3RhdGUuaGFuZGxlZE1vcnBocztcbiAgICBsZXQgaXRlbSA9IG1vcnBoTGlzdC5maXJzdENoaWxkTW9ycGg7XG5cbiAgICB3aGlsZSAoaXRlbSkge1xuICAgICAgbGV0IG5leHQgPSBpdGVtLm5leHRNb3JwaDtcblxuICAgICAgLy8gSWYgd2UgZG9uJ3Qgc2VlIHRoZSBrZXkgaW4gaGFuZGxlZE1vcnBocywgaXQgd2Fzbid0XG4gICAgICAvLyB5aWVsZGVkIGluIGFuZCB3ZSBjYW4gc2FmZWx5IHJlbW92ZSBpdCBmcm9tIERPTS5cbiAgICAgIGlmICghKGl0ZW0ua2V5IGluIGhhbmRsZWRNb3JwaHMpKSB7XG4gICAgICAgIGRlbGV0ZSBtb3JwaE1hcFtpdGVtLmtleV07XG4gICAgICAgIGNsZWFyTW9ycGgoaXRlbSwgZW52LCB0cnVlKTtcbiAgICAgICAgaXRlbS5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIGl0ZW0gPSBuZXh0O1xuICAgIH1cbiAgfVxuXG4gIG1vcnBoTGlzdCA9IHJlbmRlclN0YXRlLm1vcnBoTGlzdFRvQ2xlYXI7XG4gIGlmIChtb3JwaExpc3QpIHtcbiAgICBjbGVhck1vcnBoTGlzdChtb3JwaExpc3QsIG1vcnBoLCBlbnYpO1xuICB9XG5cbiAgbGV0IHRvQ2xlYXIgPSByZW5kZXJTdGF0ZS5tb3JwaFRvQ2xlYXI7XG4gIGlmICh0b0NsZWFyKSB7XG4gICAgY2xlYXJNb3JwaCh0b0NsZWFyLCBlbnYpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhck1vcnBoKG1vcnBoLCBlbnYsIGRlc3Ryb3lTZWxmKSB7XG4gIHZhciBjbGVhbnVwID0gZW52Lmhvb2tzLmNsZWFudXBSZW5kZXJOb2RlO1xuICB2YXIgZGVzdHJveSA9IGVudi5ob29rcy5kZXN0cm95UmVuZGVyTm9kZTtcbiAgdmFyIHdpbGxDbGVhbnVwID0gZW52Lmhvb2tzLndpbGxDbGVhbnVwVHJlZTtcbiAgdmFyIGRpZENsZWFudXAgPSBlbnYuaG9va3MuZGlkQ2xlYW51cFRyZWU7XG5cbiAgZnVuY3Rpb24gZGVzdHJveU5vZGUobm9kZSkge1xuICAgIGlmIChjbGVhbnVwKSB7IGNsZWFudXAobm9kZSk7IH1cbiAgICBpZiAoZGVzdHJveSkgeyBkZXN0cm95KG5vZGUpOyB9XG4gIH1cblxuICBpZiAod2lsbENsZWFudXApIHsgd2lsbENsZWFudXAoZW52LCBtb3JwaCwgZGVzdHJveVNlbGYpOyB9XG4gIGlmIChjbGVhbnVwKSB7IGNsZWFudXAobW9ycGgpOyB9XG4gIGlmIChkZXN0cm95U2VsZiAmJiBkZXN0cm95KSB7IGRlc3Ryb3kobW9ycGgpOyB9XG5cbiAgdmlzaXRDaGlsZHJlbihtb3JwaC5jaGlsZE5vZGVzLCBkZXN0cm95Tm9kZSk7XG5cbiAgLy8gVE9ETzogRGVhbCB3aXRoIGxvZ2ljYWwgY2hpbGRyZW4gdGhhdCBhcmUgbm90IGluIHRoZSBET00gdHJlZVxuICBtb3JwaC5jbGVhcigpO1xuICBpZiAoZGlkQ2xlYW51cCkgeyBkaWRDbGVhbnVwKGVudiwgbW9ycGgsIGRlc3Ryb3lTZWxmKTsgfVxuXG4gIG1vcnBoLmxhc3RSZXN1bHQgPSBudWxsO1xuICBtb3JwaC5sYXN0WWllbGRlZCA9IG51bGw7XG4gIG1vcnBoLmNoaWxkTm9kZXMgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJNb3JwaExpc3QobW9ycGhMaXN0LCBtb3JwaCwgZW52KSB7XG4gIGxldCBpdGVtID0gbW9ycGhMaXN0LmZpcnN0Q2hpbGRNb3JwaDtcblxuICB3aGlsZSAoaXRlbSkge1xuICAgIGxldCBuZXh0ID0gaXRlbS5uZXh0TW9ycGg7XG4gICAgZGVsZXRlIG1vcnBoLm1vcnBoTWFwW2l0ZW0ua2V5XTtcbiAgICBjbGVhck1vcnBoKGl0ZW0sIGVudiwgdHJ1ZSk7XG4gICAgaXRlbS5kZXN0cm95KCk7XG5cbiAgICBpdGVtID0gbmV4dDtcbiAgfVxuXG4gIC8vIFJlbW92ZSB0aGUgTW9ycGhMaXN0IGZyb20gdGhlIG1vcnBoLlxuICBtb3JwaExpc3QuY2xlYXIoKTtcbiAgbW9ycGgubW9ycGhMaXN0ID0gbnVsbDtcbn1cbiJdfQ==
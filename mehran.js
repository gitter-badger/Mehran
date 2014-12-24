/*!
 * Mehran selector engine
 *
 * Copyright 2014, 2015 K.F and other contributors
 * Released under the MIT license
 *
 */

(function(window, undefined) {

    var doc = window.document,
        html = doc.documentElement,
        byClass = 'getElementsByClassName',
        byTag = 'getElementsByTagName',
        byId = 'getElementById',
        byAll = 'querySelectorAll',
        idClassTagNameExp = /^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,
        unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,

        // Empty Mehran object

        Mehran = {};

    /**
     * An object used to flag environments/features.
     */

    var support = {};

    (function() {

        /**
         * Detect getElementsByClassName support.
         */

        support.byClass = !!doc[byClass];

        /**
         * Detect querySelectorAll support.
         */

        support.byAll = !!doc[byAll];

        /**
         * Detect classList support.
         */

        support.classList = !!doc.createElement('p').classList;

    }());

    function engine(all) {

        return (function(sel, ctx) {

            var nodeType, els = [],
                m = idClassTagNameExp.exec(sel);

            ctx = ctx || (ctx ? ctx.ownerDocument || ctx : document);

            if ((nodeType = ctx.nodeType) !== 1 && nodeType !== 9) {
                return els;
            }

            if (!m) {
                if ((sel = m[1])) {
                    ((els = ctx[byId](sel))) ? [els] : [];
                } else if ((sel = m[2])) {
                    els = support.byClass ? ctx[byClass](sel) : support.byAll ? ctx[byAll](m[2]) : [];
                    els = (all) ? els : els[0];
                } else if ((sel = m[3])) {
                    els = ctx[byTag](sel);
                    els = (all) ? els : els[0];
                }
            } else { // querySelectorAll fallback for now   

                if (ctx.nodeType === 1 && ctx.nodeName.toLowerCase() !== 'object') {
                    els = useRoot(ctx, sel, ctx['querySelector' + (all ? 'All' : '')]);
                } else {
                    // we can use the native qSA
                    els = ctx['querySelector' + (all ? 'All' : '')](sel);
                }
            }

            return els;
        });
    }
    var useRoot = function(context, query, method) {
        // this function creates a temporary id so we can do rooted qSA queries, this is taken from sizzle
        var oldContext = context,
            old = context.getAttribute('id'),
            nid = old || '[[__Mehran__]]',
            hasParent = context.parentNode,
            relativeHierarchySelector = /^\s*[+~]/.test(query);

        if (relativeHierarchySelector && !hasParent) {
            return [];
        }
        if (!old) {
            context.setAttribute('id', nid);
        } else {
            nid = nid.replace(/'/g, '\\$&');
        }
        if (relativeHierarchySelector && hasParent) {
            context = context.parentNode;
        }
        var selectors = query.match(unionSplit),
            i = 0,
            l = selectors.length;
        for (; i < l; i++) {
            selectors[i] = "[id='" + nid + "'] " + selectors[i];
        }
        query = selectors.join(',');

        try {
            return method.call(context, query);
        } finally {
            if (!old) {
                oldContext.removeAttribute('id');
            }
        }
    };
    Mehran.find = engine(false);
    Mehran.findAll = engine(true);


    // Expose 'findAll' to be equal with Sizzle

    window.Mehran = Mehran.findAll;

}(window));
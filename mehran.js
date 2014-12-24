/*!
 * Mehran selector engine
 *
 * Copyright 2014, 2015 K.F and other contributors
 * Released under the MIT license
 *
 * v. 0.0.1a
 */

(function(window, undefined) {

    var
        document,
        winDoc = window.document,
        docElem = winDoc.documentElement,
        byClass = 'getElementsByClassName',
        byTag = 'getElementsByTagName',
        byId = 'getElementById',
        byAll = 'querySelectorAll',
        idClassTagNameExp = /^(?:#([\w-]+)|\.([\w-]+)|(\w+))$/,
        unionSplit = /([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g,
        isHTML,

        // Internal
        arr = [],
        pop = arr.pop,
        push = arr.push,
        slice = arr.slice,

        // Empty Mehran object

        Mehran = {},

        /**
         * An object used to flag environments/features.
         */

        support = Mehran.support = {};

    (function() {

        /**
         * Detect getElementsByClassName support.
         */

        support.byClass = !!winDoc[byClass];

        /**
         * Detect querySelectorAll support.
         */

        support.byAll = !!winDoc[byAll];

        /**
         * Detect classList support.
         */

        support.classList = !!winDoc.createElement('p').classList;

    }());

    //  Detects XML nodes

    function isXML(elem) {
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== 'HTML' : false;
    }

    function setDocument(node) {

        var parent,
            doc = node ? node.ownerDocument || node : winDoc;

        // If no document and documentElement is available, return
        if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
            return document;
        }

        // Set our document
        document = doc;
        docElem = doc.documentElement;
        parent = doc.defaultView;

        if (parent && parent !== parent.top) {
            // IE11 does not have attachEvent, so all must suffer
            if (parent.addEventListener) {
                parent.addEventListener('unload', function() {
                    setDocument();
                }, false);
            } else if (parent.attachEvent) {
                parent.attachEvent('onunload', function() {
                    setDocument();
                });
            }
        }

        isHTML = !isXML(doc);
    }

    // Browser feature detection

    function engine(all) {

        return (function(sel, ctx) {

            var nodeType, els = [], elem,
                m = idClassTagNameExp.exec(sel);

            if ((ctx ? ctx.ownerDocument || ctx : winDoc) !== document) {
                setDocument(ctx);
            }

            ctx = ctx || document;

            if (typeof sel !== 'string' || !sel ||
                (nodeType = ctx.nodeType) !== 1 && nodeType !== 9 && nodeType !== 11) {

                return els;
            }

            if (isHTML) {

                if (m) {
                    if ((sel = m[1])) {
                        if (nodeType === 9) {
                            elem = ctx[byId](sel);
                            if (elem && elem.parentNode) {
                                if (elem.id === sel) {
                                    els.push(elem);
                                    return els;
                                }
                            } else {
                                return els;
                            }
                        } else {
                            // Context is not a document
                            if (ctx.ownerDocument && (elem = ctx.ownerDocument[byId](sel)) &&
                                contains(ctx, elem) && elem.id === sel) {
                                els.push(elem);
                                return els;
                            }
                        }
                        ((els = ctx[byId](sel))) ? [els] : [];
                    } else if ((sel = m[2])) {
                        push.apply(els, support.byClass ? ctx[byClass](sel) : support.byAll ? ctx[byAll](m[2]) : []);
                        return els = (all) ? els : els[0];
                    } else if ((sel = m[3])) {
                        push.apply(els, ctx[byTag](sel));
                        return els = (all) ? els : els[0];
                    }
                    // querySelectorAll
                } else if (support.byAll) {

                    if (ctx.nodeType === 1 && ctx.nodeName.toLowerCase() !== 'object') {
                        els = useRoot(ctx, sel, ctx['querySelector' + (all ? 'All' : '')]);
                    } else {
                        // we can use the native qSA
                        els = ctx['querySelector' + (all ? 'All' : '')](sel);
                    }
                }

                return els;
            }

            return nonHTML(sel, ctx);

        });
    }

    function useRoot(context, query, method) {
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
    }

    // No-QSA    

    function nonHTML() {
        return 'Mehran: Not implemented YET!';
    }

    Mehran.find = engine(false);
    Mehran.findAll = engine(true);

    // Initialize against the default document

    setDocument(document);

    // Expose 'findAll' to be equal with Sizzle

    window.Mehran = Mehran;

}(window));
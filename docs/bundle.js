
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    const modal = {
    	'create': (pList = [], pIndex = 0, pReturn = []) => {
            if (pList.length > pIndex) {
                pReturn[pList[pIndex]] = false;
                return modal.create(pList, pIndex + 1, pReturn);
            } else {
                return pReturn;
            }
        },
    	'open': (pModal, pExecBefore = () => {}) => {
            pExecBefore();
            pModal.$set({'show': true});
        },
    	'close': (pModal, pExecBefore = () => {}) => {
            pExecBefore();
            pModal.$set({'show': false});
        }
    };

    class FunctionalObject {
    	constructor(pConf, pNew = {}) {
    		const isNull = (pVal) => (!pVal && pVal !== 0 && pVal !== '' && pVal !== false);
    		const valType = (pVal, pType) => (pVal.__proto__.constructor.name === pType) ? pVal : false;
    		const valNull = (pVal) => isNull(pVal) ? null : pVal;
    		const valAttr = (pConfAttr) => {
    			if (isNull(pNew[pConfAttr.name])) {
    				if (pConfAttr.null)  {
    					return false;
    				} else {
    					return valNull(pConfAttr.def);
    				}
    			} else {
    				return valType(pNew[pConfAttr.name], pConfAttr.type);
    			}
    		};

    		pConf.forEach((confAttr) => {
    			this[confAttr.name] = valAttr(confAttr);
    		});
    		this.attrs = Object.keys(this);
    		Object.freeze(this);
    	}

    	clone() {
    		let _clone = {};
    		this.attrs.forEach((attr) => _clone[attr] = this[attr]);		
    		return _clone;
    	}

    	change(pValue = {}) {
    		return new this.constructor(pValue);
    	}
    }

    const valType = (pValue, pType) => (pValue.__proto__.constructor.name === pType) ? pValue : false;

    class List extends FunctionalObject {
        constructor(prm = []) {
            if (valType(prm, 'Array')) {
                prm = {'items': [...prm]};
            } else {
                if (prm.items && valType(prm.items, 'Array')) {
                    prm.items = prm.items.map((item) => valType(item, prm.type));
                }
            }
            super([
                {
                    'name': 'type',
                    'type': 'String'
                }, {
                    'name': 'items',
                    'type': 'Array',
                    'def': []
                }
            ], prm);
        }

        item(pIndex) {
            return {
                'pos': pIndex,
                'val': this.items[pIndex]
            };
        }
        
        first() {
            return this.item(0);
        }
        
        last() {
            return this.item(this.items.length - 1);
        }
        
        update(pIndex, pItem) {
            return (this.items[pIndex]) ?
                this.change({
                    'type': this.type,
                    'items': [
                        ...this.items.slice(0, pIndex),
                        (this.type) ? valType(pItem, this.type) : pItem,
                        ...this.items.slice(pIndex + 1)
                    ]
                }) :
                this;
        }
        
        insert(pItem, pIndex = false) {
            const _item = (this.type) ? valType(pItem, this.type) : pItem;
            return this.change({
                'type': this.type,
                'items': (pIndex) ?
                    [...this.items.slice(0, pIndex), _item, ...this.items.slice(pIndex)] :
                    [...this.items, _item]
            });        
        }
        
        remove(pIndex) {
            return (this.itens[pIndex]) ?
                this.change({
                    'type': this.type,
                    'items': [...this.items.slice(0, pIndex), ...this.items.slice(pIndex + 1)]
                }) :
                this.itens;
        }
    }

    const app = {
    	'list': List,
    	'modal': modal
    };

    /* src\components\header.svelte generated by Svelte v3.12.1 */

    const file = "src\\components\\header.svelte";

    function create_fragment(ctx) {
    	var header, h1, t;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			t = text(ctx.title);
    			attr_dev(h1, "class", "svelte-re7jeo");
    			add_location(h1, file, 22, 4, 443);
    			attr_dev(header, "class", "svelte-re7jeo");
    			add_location(header, file, 21, 0, 429);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.title) {
    				set_data_dev(t, ctx.title);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(header);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { title } = $$props;

    	const writable_props = ['title'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	$$self.$capture_state = () => {
    		return { title };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	return { title };
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["title"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Header", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<Header> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\systems\sysButton.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\components\\systems\\sysButton.svelte";

    function create_fragment$1(ctx) {
    	var button, button_class_value, current, dispose;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			button = element("button");

    			if (default_slot) default_slot.c();

    			attr_dev(button, "class", button_class_value = "-icon " + ctx.style + " svelte-1t1ul05");
    			add_location(button, file$1, 19, 0, 368);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(button_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			if ((!current || changed.style) && button_class_value !== (button_class_value = "-icon " + ctx.style + " svelte-1t1ul05")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { style } = $$props;

    	const writable_props = ['style'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<SysButton> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { style };
    	};

    	$$self.$inject_state = $$props => {
    		if ('style' in $$props) $$invalidate('style', style = $$props.style);
    	};

    	return { style, click_handler, $$slots, $$scope };
    }

    class SysButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["style"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "SysButton", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.style === undefined && !('style' in props)) {
    			console.warn("<SysButton> was created without expected prop 'style'");
    		}
    	}

    	get style() {
    		throw new Error("<SysButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<SysButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\modal.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\components\\modal.svelte";

    // (30:4) <SysButton style="border" on:click={close}>
    function create_default_slot(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(30:4) <SysButton style=\"border\" on:click={close}>", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var div, t0, t1, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	var sysbutton = new SysButton({
    		props: {
    		style: "border",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});
    	sysbutton.$on("click", ctx.close);

    	const block = {
    		c: function create() {
    			div = element("div");

    			if (!default_slot) {
    				t0 = text("Modal Error");
    			}

    			if (default_slot) default_slot.c();
    			t1 = space();
    			sysbutton.$$.fragment.c();

    			attr_dev(div, "class", "modal svelte-r605un");
    			toggle_class(div, "show", ctx.show);
    			add_location(div, file$2, 27, 0, 591);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(div_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!default_slot) {
    				append_dev(div, t0);
    			}

    			else {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t1);
    			mount_component(sysbutton, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			var sysbutton_changes = {};
    			if (changed.$$scope) sysbutton_changes.$$scope = { changed, ctx };
    			sysbutton.$set(sysbutton_changes);

    			if (changed.show) {
    				toggle_class(div, "show", ctx.show);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			transition_in(sysbutton.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(sysbutton.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (default_slot) default_slot.d(detaching);

    			destroy_component(sysbutton);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { show = false } = $$props;

        const close = () => $$invalidate('show', show = false);

    	const writable_props = ['show'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { show };
    	};

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate('show', show = $$props.show);
    	};

    	return { show, close, $$slots, $$scope };
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["show"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Modal", options, id: create_fragment$2.name });
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\systems\sysForm.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\components\\systems\\sysForm.svelte";

    function create_fragment$3(ctx) {
    	var form, t, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			form = element("form");

    			if (!default_slot) {
    				t = text("Form Error");
    			}

    			if (default_slot) default_slot.c();

    			attr_dev(form, "class", "svelte-1x63c83");
    			add_location(form, file$3, 39, 0, 1113);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(form_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);

    			if (!default_slot) {
    				append_dev(form, t);
    			}

    			else {
    				default_slot.m(form, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(form);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { $$slots, $$scope };
    }

    class SysForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "SysForm", options, id: create_fragment$3.name });
    	}
    }

    class Transaction extends FunctionalObject {
        constructor(prm) {
            super([
                {
                    'name': 'type',
                    'type': 'Number',
                    'null': true
                }, {
                    'name': 'value',
                    'type': 'Number',
                    'null': true
                }
            ], prm);
        }
    }

    const model = {
        'name': 'Nova conta',
        'color': '#ffffff',
        'balance': 0,
        'transactions': new List({
            'type': 'Transaction'
        })
    };

    class Wallet extends FunctionalObject {
        constructor(prm = model) {
            console.log(prm);
            super([
                {
                    'name': 'name',
                    'type': 'String',
                    'null': true
                }, {
                    'name': 'color',
                    'type': 'String'
                }, {
                    'name': 'balance',
                    'type': 'Number',
                    'def': model.balance
                }, {
                    'name': 'transactions',
                    'type': 'List',
                    'def': model.transactions
                }
            ], prm);
        }   

        reset() {
            return this.change(model);
        }
        
        in() {
            return this.transactions.items.reduce((a, i) => a + (i.type === 1 ? i.value : 0), 0);
        }

        out() {
            return this.transactions.items.reduce((a, i) => a + (i.type === 2 ? i.value : 0), 0);
        }

        transaction(pValue, pType) {
            let _clone = this.clone();
            _clone.transactions = _clone.transactions.insert(new Transaction({
                'type': pType,
                'value': pValue
            }));
            return this.change(_clone);
        }

        adjust(pValue) {
            let _clone = this.clone();
            _clone.balance = pValue;
            return this.change(_clone);
        }
    }

    /* src\components\forms\frmNewWallet.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\components\\forms\\frmNewWallet.svelte";

    // (15:0) <SysForm>
    function create_default_slot$1(ctx) {
    	var input0, t0, input1, input1_updating = false, t1, input2, t2, input3, input3_disabled_value, dispose;

    	function input1_input_handler() {
    		input1_updating = true;
    		ctx.input1_input_handler.call(input1);
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Nome da Conta");
    			add_location(input0, file$4, 15, 4, 357);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "placeholder", "Valor da Conta");
    			add_location(input1, file$4, 16, 4, 437);
    			attr_dev(input2, "type", "color");
    			add_location(input2, file$4, 17, 4, 523);
    			attr_dev(input3, "type", "button");
    			input3.disabled = input3_disabled_value = !(ctx.wallet.name && ctx.wallet.balance > 0);
    			input3.value = "Salvar";
    			add_location(input3, file$4, 18, 4, 577);

    			dispose = [
    				listen_dev(input0, "input", ctx.input0_input_handler),
    				listen_dev(input1, "input", input1_input_handler),
    				listen_dev(input2, "input", ctx.input2_input_handler),
    				listen_dev(input3, "click", ctx.submit)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);

    			set_input_value(input0, ctx.wallet.name);

    			insert_dev(target, t0, anchor);
    			insert_dev(target, input1, anchor);

    			set_input_value(input1, ctx.wallet.balance);

    			insert_dev(target, t1, anchor);
    			insert_dev(target, input2, anchor);

    			set_input_value(input2, ctx.wallet.color);

    			insert_dev(target, t2, anchor);
    			insert_dev(target, input3, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (changed.wallet && (input0.value !== ctx.wallet.name)) set_input_value(input0, ctx.wallet.name);
    			if (!input1_updating && changed.wallet) set_input_value(input1, ctx.wallet.balance);
    			input1_updating = false;
    			if (changed.wallet) set_input_value(input2, ctx.wallet.color);

    			if ((changed.wallet) && input3_disabled_value !== (input3_disabled_value = !(ctx.wallet.name && ctx.wallet.balance > 0))) {
    				prop_dev(input3, "disabled", input3_disabled_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(input0);
    				detach_dev(t0);
    				detach_dev(input1);
    				detach_dev(t1);
    				detach_dev(input2);
    				detach_dev(t2);
    				detach_dev(input3);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$1.name, type: "slot", source: "(15:0) <SysForm>", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var current;

    	var sysform = new SysForm({
    		props: {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			sysform.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(sysform, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var sysform_changes = {};
    			if (changed.$$scope || changed.wallet) sysform_changes.$$scope = { changed, ctx };
    			sysform.$set(sysform_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(sysform.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(sysform.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(sysform, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

        let { returnExec } = $$props;
        
        let wallet = new Wallet().clone();
        
        const submit = () => {
            returnExec(new Wallet(wallet));
            $$invalidate('wallet', wallet = new Wallet().clone());
        };

    	const writable_props = ['returnExec'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<FrmNewWallet> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		wallet.name = this.value;
    		$$invalidate('wallet', wallet);
    	}

    	function input1_input_handler() {
    		wallet.balance = to_number(this.value);
    		$$invalidate('wallet', wallet);
    	}

    	function input2_input_handler() {
    		wallet.color = this.value;
    		$$invalidate('wallet', wallet);
    	}

    	$$self.$set = $$props => {
    		if ('returnExec' in $$props) $$invalidate('returnExec', returnExec = $$props.returnExec);
    	};

    	$$self.$capture_state = () => {
    		return { returnExec, wallet };
    	};

    	$$self.$inject_state = $$props => {
    		if ('returnExec' in $$props) $$invalidate('returnExec', returnExec = $$props.returnExec);
    		if ('wallet' in $$props) $$invalidate('wallet', wallet = $$props.wallet);
    	};

    	return {
    		returnExec,
    		wallet,
    		submit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	};
    }

    class FrmNewWallet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["returnExec"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "FrmNewWallet", options, id: create_fragment$4.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.returnExec === undefined && !('returnExec' in props)) {
    			console.warn("<FrmNewWallet> was created without expected prop 'returnExec'");
    		}
    	}

    	get returnExec() {
    		throw new Error("<FrmNewWallet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnExec(value) {
    		throw new Error("<FrmNewWallet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\wallets.svelte generated by Svelte v3.12.1 */

    const file$5 = "src\\components\\wallets.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (92:4) {#each walletsList.items as item}
    function create_each_block(ctx) {
    	var li, b0, t0_value = ctx.item.name + "", t0, t1, b1, t2, t3_value = ctx.item.balance + "", t3, t4;

    	const block = {
    		c: function create() {
    			li = element("li");
    			b0 = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			b1 = element("b");
    			t2 = text("R$ ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(b0, "class", "svelte-wymw3e");
    			add_location(b0, file$5, 93, 12, 2593);
    			attr_dev(b1, "class", "svelte-wymw3e");
    			add_location(b1, file$5, 94, 12, 2625);
    			set_style(li, "box-shadow", "0 0 0 0.2rem " + ctx.item.color + " inset");
    			attr_dev(li, "class", "svelte-wymw3e");
    			add_location(li, file$5, 92, 8, 2523);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, b0);
    			append_dev(b0, t0);
    			append_dev(li, t1);
    			append_dev(li, b1);
    			append_dev(b1, t2);
    			append_dev(b1, t3);
    			append_dev(li, t4);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.walletsList) && t0_value !== (t0_value = ctx.item.name + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.walletsList) && t3_value !== (t3_value = ctx.item.balance + "")) {
    				set_data_dev(t3, t3_value);
    			}

    			if (changed.walletsList) {
    				set_style(li, "box-shadow", "0 0 0 0.2rem " + ctx.item.color + " inset");
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(92:4) {#each walletsList.items as item}", ctx });
    	return block;
    }

    // (101:4) <SysButton style="border" on:click={() => App.modal.open(modal['new'])}>
    function create_default_slot_1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(101:4) <SysButton style=\"border\" on:click={() => App.modal.open(modal['new'])}>", ctx });
    	return block;
    }

    // (104:0) <Modal bind:this={modal['new']}>
    function create_default_slot$2(ctx) {
    	var current;

    	var newwallet = new FrmNewWallet({
    		props: { returnExec: ctx.addWalletList },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			newwallet.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(newwallet, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(newwallet.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(newwallet.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(newwallet, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$2.name, type: "slot", source: "(104:0) <Modal bind:this={modal['new']}>", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var ul, t0, div, t1, current;

    	let each_value = ctx.walletsList.items;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	var sysbutton = new SysButton({
    		props: {
    		style: "border",
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});
    	sysbutton.$on("click", ctx.click_handler);

    	let modal_1_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};
    	var modal_1 = new Modal({ props: modal_1_props, $$inline: true });

    	ctx.modal_1_binding(modal_1);

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			sysbutton.$$.fragment.c();
    			t1 = space();
    			modal_1.$$.fragment.c();
    			attr_dev(ul, "class", "svelte-wymw3e");
    			add_location(ul, file$5, 90, 0, 2470);
    			attr_dev(div, "class", "align svelte-wymw3e");
    			add_location(div, file$5, 99, 0, 2689);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(sysbutton, div, null);
    			insert_dev(target, t1, anchor);
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.walletsList) {
    				each_value = ctx.walletsList.items;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			var sysbutton_changes = {};
    			if (changed.$$scope) sysbutton_changes.$$scope = { changed, ctx };
    			sysbutton.$set(sysbutton_changes);

    			var modal_1_changes = {};
    			if (changed.$$scope) modal_1_changes.$$scope = { changed, ctx };
    			modal_1.$set(modal_1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(sysbutton.$$.fragment, local);

    			transition_in(modal_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(sysbutton.$$.fragment, local);
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(div);
    			}

    			destroy_component(sysbutton);

    			if (detaching) {
    				detach_dev(t1);
    			}

    			ctx.modal_1_binding(null);

    			destroy_component(modal_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	
        
        let { App } = $$props;   

        let modal = App.modal.create(['new']);
        let walletsList = new List({
            'type': 'Wallet'
        });

        const addWalletList = (pNewWallet) => {
            $$invalidate('walletsList', walletsList = walletsList.insert(pNewWallet));
            App.modal.close(modal['new']);
        };

        $$invalidate('walletsList', walletsList = walletsList .insert(new Wallet({
            'name': 'Conta teste',
            'color': '#0fc0fc'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#ffffff'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#ff0000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#00ff00'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#0000ff'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#ffff00'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#ff00ff'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#00ffff'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })).insert(new Wallet({
            'name': 'Conta teste',
            'color': '#000000'
        })));

    	const writable_props = ['App'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Wallets> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => App.modal.open(modal['new']);

    	function modal_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal['new'] = $$value;
    			$$invalidate('modal', modal);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('App' in $$props) $$invalidate('App', App = $$props.App);
    	};

    	$$self.$capture_state = () => {
    		return { App, modal, walletsList };
    	};

    	$$self.$inject_state = $$props => {
    		if ('App' in $$props) $$invalidate('App', App = $$props.App);
    		if ('modal' in $$props) $$invalidate('modal', modal = $$props.modal);
    		if ('walletsList' in $$props) $$invalidate('walletsList', walletsList = $$props.walletsList);
    	};

    	return {
    		App,
    		modal,
    		walletsList,
    		addWalletList,
    		click_handler,
    		modal_1_binding
    	};
    }

    class Wallets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["App"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Wallets", options, id: create_fragment$5.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.App === undefined && !('App' in props)) {
    			console.warn("<Wallets> was created without expected prop 'App'");
    		}
    	}

    	get App() {
    		throw new Error("<Wallets>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set App(value) {
    		throw new Error("<Wallets>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.1 */

    function create_fragment$6(ctx) {
    	var t, current;

    	var header = new Header({
    		props: { title: ctx.title },
    		$$inline: true
    	});

    	var wallets = new Wallets({
    		props: { App: app },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			header.$$.fragment.c();
    			t = space();
    			wallets.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(wallets, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var header_changes = {};
    			if (changed.title) header_changes.title = ctx.title;
    			header.$set(header_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);

    			transition_in(wallets.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(wallets.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(header, detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			destroy_component(wallets, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	

    	let { title } = $$props;

    	const writable_props = ['title'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	$$self.$capture_state = () => {
    		return { title };
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    	};

    	return { title };
    }

    class App_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["title"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App_1", options, id: create_fragment$6.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.title === undefined && !('title' in props)) {
    			console.warn("<App> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app$1 = new App_1({
    	'target': document.body,
    	'props': {
    		'title': 'wallet'
    	}
    });

    return app$1;

}());
//# sourceMappingURL=bundle.js.map

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, ElementRef, EventEmitter, ViewChild, HostListener, ContentChildren, QueryList, HostBinding, ContentChild, KeyValueDiffers, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, Optional, Inject } from '@angular/core';
import { DatatableGroupHeaderDirective } from './body/body-group-header.directive';
import { BehaviorSubject } from 'rxjs';
import { groupRowsByParents, optionalGetterForProp } from '../utils/tree';
import { setColumnDefaults, translateTemplates } from '../utils/column-helper';
import { ColumnMode } from '../types/column-mode.type';
import { SelectionType } from '../types/selection.type';
import { SortType } from '../types/sort.type';
import { ContextmenuType } from '../types/contextmenu.type';
import { DataTableColumnDirective } from './columns/column.directive';
import { DatatableRowDetailDirective } from './row-detail/row-detail.directive';
import { DatatableFooterDirective } from './footer/footer.directive';
import { DataTableBodyComponent } from './body/body.component';
import { DataTableHeaderComponent } from './header/header.component';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { ColumnChangesService } from '../services/column-changes.service';
import { DimensionsHelper } from '../services/dimensions-helper.service';
import { throttleable } from '../utils/throttle';
import { forceFillColumnWidths, adjustColumnWidths } from '../utils/math';
import { sortRows } from '../utils/sort';
export class DatatableComponent {
    /**
     * @param {?} scrollbarHelper
     * @param {?} dimensionsHelper
     * @param {?} cd
     * @param {?} element
     * @param {?} differs
     * @param {?} columnChangesService
     * @param {?} configuration
     */
    constructor(scrollbarHelper, dimensionsHelper, cd, element, differs, columnChangesService, configuration) {
        this.scrollbarHelper = scrollbarHelper;
        this.dimensionsHelper = dimensionsHelper;
        this.cd = cd;
        this.columnChangesService = columnChangesService;
        this.configuration = configuration;
        /**
         * List of row objects that should be
         * represented as selected in the grid.
         * Default value: `[]`
         */
        this.selected = [];
        /**
         * Enable vertical scrollbars
         */
        this.scrollbarV = false;
        /**
         * Enable horz scrollbars
         */
        this.scrollbarH = false;
        /**
         * The row height; which is necessary
         * to calculate the height for the lazy rendering.
         */
        this.rowHeight = 30;
        /**
         * Type of column width distribution formula.
         * Example: flex, force, standard
         */
        this.columnMode = ColumnMode.standard;
        /**
         * The minimum header height in pixels.
         * Pass a falsey for no header
         */
        this.headerHeight = 30;
        /**
         * The minimum footer height in pixels.
         * Pass falsey for no footer
         */
        this.footerHeight = 0;
        /**
         * If the table should use external paging
         * otherwise its assumed that all data is preloaded.
         */
        this.externalPaging = false;
        /**
         * If the table should use external sorting or
         * the built-in basic sorting.
         */
        this.externalSorting = false;
        /**
         * Show the linear loading bar.
         * Default value: `false`
         */
        this.loadingIndicator = false;
        /**
         * Enable/Disable ability to re-order columns
         * by dragging them.
         */
        this.reorderable = true;
        /**
         * Swap columns on re-order columns or
         * move them.
         */
        this.swapColumns = true;
        /**
         * The type of sorting
         */
        this.sortType = SortType.single;
        /**
         * Array of sorted columns by property and type.
         * Default value: `[]`
         */
        this.sorts = [];
        /**
         * Css class overrides
         */
        this.cssClasses = {
            sortAscending: 'datatable-icon-up',
            sortDescending: 'datatable-icon-down',
            pagerLeftArrow: 'datatable-icon-left',
            pagerRightArrow: 'datatable-icon-right',
            pagerPrevious: 'datatable-icon-prev',
            pagerNext: 'datatable-icon-skip'
        };
        /**
         * Message overrides for localization
         *
         * emptyMessage     [default] = 'No data to display'
         * totalMessage     [default] = 'total'
         * selectedMessage  [default] = 'selected'
         */
        this.messages = {
            // Message to show when array is presented
            // but contains no values
            emptyMessage: 'No data to display',
            // Footer total message
            totalMessage: 'total',
            // Footer selected message
            selectedMessage: 'selected'
        };
        /**
         * A boolean you can use to set the detault behaviour of rows and groups
         * whether they will start expanded or not. If ommited the default is NOT expanded.
         *
         */
        this.groupExpansionDefault = false;
        /**
         * Property to which you can use for determining select all
         * rows on current page or not.
         *
         * \@memberOf DatatableComponent
         */
        this.selectAllRowsOnPage = false;
        /**
         * A flag for row virtualization on / off
         */
        this.virtualization = true;
        /**
         * A flag for switching summary row on / off
         */
        this.summaryRow = false;
        /**
         * A height of summary row
         */
        this.summaryHeight = 30;
        /**
         * A property holds a summary row position: top/bottom
         */
        this.summaryPosition = 'top';
        /**
         * Body was scrolled typically in a `scrollbarV:true` scenario.
         */
        this.scroll = new EventEmitter();
        /**
         * A row was added
         */
        this.rowInited = new EventEmitter();
        /**
         * A cell or row was focused via keyboard or mouse click.
         */
        this.activate = new EventEmitter();
        /**
         * A cell or row was selected.
         */
        this.select = new EventEmitter();
        /**
         * Column sort was invoked.
         */
        this.sort = new EventEmitter();
        /**
         * The table was paged either triggered by the pager or the body scroll.
         */
        this.page = new EventEmitter();
        /**
         * Columns were re-ordered.
         */
        this.reorder = new EventEmitter();
        /**
         * Column was resized.
         */
        this.resize = new EventEmitter();
        /**
         * The context menu was invoked on the table.
         * type indicates whether the header or the body was clicked.
         * content contains either the column or the row that was clicked.
         */
        this.tableContextmenu = new EventEmitter(false);
        this.tableRowAdded = new EventEmitter();
        /**
         * A row was expanded ot collapsed for tree
         */
        this.treeAction = new EventEmitter();
        this.rowCount = 0;
        this._offsetX = new BehaviorSubject(0);
        this._count = 0;
        this._offset = 0;
        this._subscriptions = [];
        /**
         * This will be used when displaying or selecting rows.
         * when tracking/comparing them, we'll use the value of this fn,
         *
         * (`fn(x) === fn(y)` instead of `x === y`)
         */
        this.rowIdentity = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => x);
        // get ref to elm for measuring
        this.element = element.nativeElement;
        this.rowDiffer = differs.find({}).create();
        // apply global settings from Module.forRoot
        if (this.configuration && this.configuration.messages) {
            this.messages = Object.assign({}, this.configuration.messages);
        }
    }
    /**
     * Rows that are displayed in the table.
     * @param {?} val
     * @return {?}
     */
    set rows(val) {
        this._rows = val;
        if (val) {
            this._internalRows = [...val];
        }
        // auto sort on new updates
        if (!this.externalSorting) {
            this.sortInternalRows();
        }
        // auto group by parent on new update
        this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
        // recalculate sizes/etc
        this.recalculate();
        if (this._rows && this._groupRowsBy) {
            // If a column has been specified in _groupRowsBy created a new array with the data grouped by that row
            this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
        }
        this.cd.markForCheck();
    }
    /**
     * Gets the rows.
     * @return {?}
     */
    get rows() {
        return this._rows;
    }
    /**
     * This attribute allows the user to set the name of the column to group the data with
     * @param {?} val
     * @return {?}
     */
    set groupRowsBy(val) {
        if (val) {
            this._groupRowsBy = val;
            if (this._rows && this._groupRowsBy) {
                // cretes a new array with the data grouped
                this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
            }
        }
    }
    /**
     * @return {?}
     */
    get groupRowsBy() {
        return this._groupRowsBy;
    }
    /**
     * Columns to be displayed.
     * @param {?} val
     * @return {?}
     */
    set columns(val) {
        if (val) {
            this._internalColumns = [...val];
            setColumnDefaults(this._internalColumns);
            this.recalculateColumns();
        }
        this._columns = val;
    }
    /**
     * Get the columns.
     * @return {?}
     */
    get columns() {
        return this._columns;
    }
    /**
     * The page size to be shown.
     * Default value: `undefined`
     * @param {?} val
     * @return {?}
     */
    set limit(val) {
        this._limit = val;
        // recalculate sizes/etc
        this.recalculate();
    }
    /**
     * Gets the limit.
     * @return {?}
     */
    get limit() {
        return this._limit;
    }
    /**
     * The total count of all rows.
     * Default value: `0`
     * @param {?} val
     * @return {?}
     */
    set count(val) {
        this._count = val;
        // recalculate sizes/etc
        this.recalculate();
    }
    /**
     * Gets the count.
     * @return {?}
     */
    get count() {
        return this._count;
    }
    /**
     * The current offset ( page - 1 ) shown.
     * Default value: `0`
     * @param {?} val
     * @return {?}
     */
    set offset(val) {
        this._offset = val;
    }
    /**
     * @return {?}
     */
    get offset() {
        return Math.max(Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1), 0);
    }
    /**
     * CSS class applied if the header height if fixed height.
     * @return {?}
     */
    get isFixedHeader() {
        /** @type {?} */
        const headerHeight = this.headerHeight;
        return typeof headerHeight === 'string' ? (/** @type {?} */ (headerHeight)) !== 'auto' : true;
    }
    /**
     * CSS class applied to the root element if
     * the row heights are fixed heights.
     * @return {?}
     */
    get isFixedRow() {
        return this.rowHeight !== 'auto';
    }
    /**
     * CSS class applied to root element if
     * vertical scrolling is enabled.
     * @return {?}
     */
    get isVertScroll() {
        return this.scrollbarV;
    }
    /**
     * CSS class applied to root element if
     * virtualization is enabled.
     * @return {?}
     */
    get isVirtualized() {
        return this.virtualization;
    }
    /**
     * CSS class applied to the root element
     * if the horziontal scrolling is enabled.
     * @return {?}
     */
    get isHorScroll() {
        return this.scrollbarH;
    }
    /**
     * CSS class applied to root element is selectable.
     * @return {?}
     */
    get isSelectable() {
        return this.selectionType !== undefined;
    }
    /**
     * CSS class applied to root is checkbox selection.
     * @return {?}
     */
    get isCheckboxSelection() {
        return this.selectionType === SelectionType.checkbox;
    }
    /**
     * CSS class applied to root if cell selection.
     * @return {?}
     */
    get isCellSelection() {
        return this.selectionType === SelectionType.cell;
    }
    /**
     * CSS class applied to root if single select.
     * @return {?}
     */
    get isSingleSelection() {
        return this.selectionType === SelectionType.single;
    }
    /**
     * CSS class added to root element if mulit select
     * @return {?}
     */
    get isMultiSelection() {
        return this.selectionType === SelectionType.multi;
    }
    /**
     * CSS class added to root element if mulit click select
     * @return {?}
     */
    get isMultiClickSelection() {
        return this.selectionType === SelectionType.multiClick;
    }
    /**
     * Column templates gathered from `ContentChildren`
     * if described in your markup.
     * @param {?} val
     * @return {?}
     */
    set columnTemplates(val) {
        this._columnTemplates = val;
        this.translateColumns(val);
    }
    /**
     * Returns the column templates.
     * @return {?}
     */
    get columnTemplates() {
        return this._columnTemplates;
    }
    /**
     * Returns if all rows are selected.
     * @return {?}
     */
    get allRowsSelected() {
        /** @type {?} */
        let allRowsSelected = this.rows && this.selected && this.selected.length === this.rows.length;
        if (this.selectAllRowsOnPage) {
            /** @type {?} */
            const indexes = this.bodyComponent.indexes;
            /** @type {?} */
            const rowsOnPage = indexes.last - indexes.first;
            allRowsSelected = this.selected.length === rowsOnPage;
        }
        return this.selected && this.rows && this.rows.length !== 0 && allRowsSelected;
    }
    /**
     * Lifecycle hook that is called after data-bound
     * properties of a directive are initialized.
     * @return {?}
     */
    ngOnInit() {
        // need to call this immediatly to size
        // if the table is hidden the visibility
        // listener will invoke this itself upon show
        this.recalculate();
    }
    /**
     * Lifecycle hook that is called after a component's
     * view has been fully initialized.
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this.externalSorting) {
            this.sortInternalRows();
        }
        // this has to be done to prevent the change detection
        // tree from freaking out because we are readjusting
        if (typeof requestAnimationFrame === 'undefined') {
            return;
        }
        requestAnimationFrame((/**
         * @return {?}
         */
        () => {
            this.recalculate();
            // emit page for virtual server-side kickoff
            if (this.externalPaging && this.scrollbarV) {
                this.page.emit({
                    count: this.count,
                    pageSize: this.pageSize,
                    limit: this.limit,
                    offset: 0
                });
            }
        }));
    }
    /**
     * Lifecycle hook that is called after a component's
     * content has been fully initialized.
     * @return {?}
     */
    ngAfterContentInit() {
        this.columnTemplates.changes.subscribe((/**
         * @param {?} v
         * @return {?}
         */
        v => this.translateColumns(v)));
        this.listenForColumnInputChanges();
    }
    /**
     * Translates the templates to the column objects
     * @param {?} val
     * @return {?}
     */
    translateColumns(val) {
        if (val) {
            /** @type {?} */
            const arr = val.toArray();
            if (arr.length) {
                this._internalColumns = translateTemplates(arr);
                setColumnDefaults(this._internalColumns);
                this.recalculateColumns();
                this.sortInternalRows();
                this.cd.markForCheck();
            }
        }
    }
    /**
     * Creates a map with the data grouped by the user choice of grouping index
     *
     * @param {?} originalArray the original array passed via parameter
     * @param {?} groupBy
     * @return {?}
     */
    groupArrayBy(originalArray, groupBy) {
        // create a map to hold groups with their corresponding results
        /** @type {?} */
        const map = new Map();
        /** @type {?} */
        let i = 0;
        originalArray.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            /** @type {?} */
            const key = item[groupBy];
            if (!map.has(key)) {
                map.set(key, [item]);
            }
            else {
                map.get(key).push(item);
            }
            i++;
        }));
        /** @type {?} */
        const addGroup = (/**
         * @param {?} key
         * @param {?} value
         * @return {?}
         */
        (key, value) => {
            return { key, value };
        });
        // convert map back to a simple array of objects
        return Array.from(map, (/**
         * @param {?} x
         * @return {?}
         */
        x => addGroup(x[0], x[1])));
    }
    /*
       * Lifecycle hook that is called when Angular dirty checks a directive.
       */
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.rowDiffer.diff(this.rows)) {
            if (!this.externalSorting) {
                this.sortInternalRows();
            }
            else {
                this._internalRows = [...this.rows];
            }
            // auto group by parent on new update
            this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
            this.recalculatePages();
            this.cd.markForCheck();
        }
    }
    /**
     * Recalc's the sizes of the grid.
     *
     * Updated automatically on changes to:
     *
     *  - Columns
     *  - Rows
     *  - Paging related
     *
     * Also can be manually invoked or upon window resize.
     * @return {?}
     */
    recalculate() {
        this.recalculateDims();
        this.recalculateColumns();
    }
    /**
     * Window resize handler to update sizes.
     * @return {?}
     */
    onWindowResize() {
        this.recalculate();
    }
    /**
     * Recalulcates the column widths based on column width
     * distribution mode and scrollbar offsets.
     * @param {?=} columns
     * @param {?=} forceIdx
     * @param {?=} allowBleed
     * @return {?}
     */
    recalculateColumns(columns = this._internalColumns, forceIdx = -1, allowBleed = this.scrollbarH) {
        if (!columns)
            return undefined;
        /** @type {?} */
        let width = this._innerWidth;
        if (this.scrollbarV) {
            width = width - this.scrollbarHelper.width;
        }
        if (this.columnMode === ColumnMode.force) {
            forceFillColumnWidths(columns, width, forceIdx, allowBleed);
        }
        else if (this.columnMode === ColumnMode.flex) {
            adjustColumnWidths(columns, width);
        }
        return columns;
    }
    /**
     * Recalculates the dimensions of the table size.
     * Internally calls the page size and row count calcs too.
     *
     * @return {?}
     */
    recalculateDims() {
        /** @type {?} */
        const dims = this.dimensionsHelper.getDimensions(this.element);
        this._innerWidth = Math.floor(dims.width);
        if (this.scrollbarV) {
            /** @type {?} */
            let height = dims.height;
            if (this.headerHeight)
                height = height - this.headerHeight;
            if (this.footerHeight)
                height = height - this.footerHeight;
            this.bodyHeight = height;
        }
        this.recalculatePages();
    }
    /**
     * Recalculates the pages after a update.
     * @return {?}
     */
    recalculatePages() {
        this.pageSize = this.calcPageSize();
        this.rowCount = this.calcRowCount();
    }
    /**
     * Body triggered a page event.
     * @param {?} __0
     * @return {?}
     */
    onBodyPage({ offset }) {
        // Avoid pagination caming from body events like scroll when the table
        // has no virtualization and the external paging is enable.
        // This means, let's the developer handle pagination by my him(her) self
        if (this.externalPaging && !this.virtualization) {
            return;
        }
        this.offset = offset;
        this.page.emit({
            count: this.count,
            pageSize: this.pageSize,
            limit: this.limit,
            offset: this.offset
        });
    }
    /**
     * The body triggered a scroll event.
     * @param {?} event
     * @return {?}
     */
    onBodyScroll(event) {
        this._offsetX.next(event.offsetX);
        this.scroll.emit(event);
        this.cd.detectChanges();
    }
    /**
     * The footer triggered a page event.
     * @param {?} event
     * @return {?}
     */
    onFooterPage(event) {
        this.offset = event.page - 1;
        this.bodyComponent.updateOffsetY(this.offset);
        this.page.emit({
            count: this.count,
            pageSize: this.pageSize,
            limit: this.limit,
            offset: this.offset
        });
        if (this.selectAllRowsOnPage) {
            this.selected = [];
            this.select.emit({
                selected: this.selected
            });
        }
    }
    /**
     * Pass on rowInited event
     * @param {?} event
     * @return {?}
     */
    onRowInited(event) {
        this.rowInited.emit(event);
    }
    /**
     * Recalculates the sizes of the page
     * @param {?=} val
     * @return {?}
     */
    calcPageSize(val = this.rows) {
        // Keep the page size constant even if the row has been expanded.
        // This is because an expanded row is still considered to be a child of
        // the original row.  Hence calculation would use rowHeight only.
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            const size = Math.ceil(this.bodyHeight / ((/** @type {?} */ (this.rowHeight))));
            return Math.max(size, 0);
        }
        // if limit is passed, we are paging
        if (this.limit !== undefined) {
            return this.limit;
        }
        // otherwise use row length
        if (val) {
            return val.length;
        }
        // other empty :(
        return 0;
    }
    /**
     * Calculates the row count.
     * @param {?=} val
     * @return {?}
     */
    calcRowCount(val = this.rows) {
        if (!this.externalPaging) {
            if (!val)
                return 0;
            if (this.groupedRows) {
                return this.groupedRows.length;
            }
            else if (this.treeFromRelation != null && this.treeToRelation != null) {
                return this._internalRows.length;
            }
            else {
                return val.length;
            }
        }
        return this.count;
    }
    /**
     * The header triggered a contextmenu event.
     * @param {?} __0
     * @return {?}
     */
    onColumnContextmenu({ event, column }) {
        this.tableContextmenu.emit({ event, type: ContextmenuType.header, content: column });
    }
    /**
     * The body triggered a contextmenu event.
     * @param {?} __0
     * @return {?}
     */
    onRowContextmenu({ event, row }) {
        this.tableContextmenu.emit({ event, type: ContextmenuType.body, content: row });
    }
    /**
     * The header triggered a column resize event.
     * @param {?} __0
     * @return {?}
     */
    onColumnResize({ column, newValue }) {
        /* Safari/iOS 10.2 workaround */
        if (column === undefined) {
            return;
        }
        /** @type {?} */
        let idx;
        /** @type {?} */
        const cols = this._internalColumns.map((/**
         * @param {?} c
         * @param {?} i
         * @return {?}
         */
        (c, i) => {
            c = Object.assign({}, c);
            if (c.$$id === column.$$id) {
                idx = i;
                c.width = newValue;
                // set this so we can force the column
                // width distribution to be to this value
                c.$$oldWidth = newValue;
            }
            return c;
        }));
        this.recalculateColumns(cols, idx);
        this._internalColumns = cols;
        this.resize.emit({
            column,
            newValue
        });
    }
    /**
     * The header triggered a column re-order event.
     * @param {?} __0
     * @return {?}
     */
    onColumnReorder({ column, newValue, prevValue }) {
        /** @type {?} */
        const cols = this._internalColumns.map((/**
         * @param {?} c
         * @return {?}
         */
        c => {
            return Object.assign({}, c);
        }));
        if (this.swapColumns) {
            /** @type {?} */
            const prevCol = cols[newValue];
            cols[newValue] = column;
            cols[prevValue] = prevCol;
        }
        else {
            if (newValue > prevValue) {
                /** @type {?} */
                const movedCol = cols[prevValue];
                for (let i = prevValue; i < newValue; i++) {
                    cols[i] = cols[i + 1];
                }
                cols[newValue] = movedCol;
            }
            else {
                /** @type {?} */
                const movedCol = cols[prevValue];
                for (let i = prevValue; i > newValue; i--) {
                    cols[i] = cols[i - 1];
                }
                cols[newValue] = movedCol;
            }
        }
        this._internalColumns = cols;
        this.reorder.emit({
            column,
            newValue,
            prevValue
        });
    }
    /**
     * The header triggered a column sort event.
     * @param {?} event
     * @return {?}
     */
    onColumnSort(event) {
        // clean selected rows
        if (this.selectAllRowsOnPage) {
            this.selected = [];
            this.select.emit({
                selected: this.selected
            });
        }
        this.sorts = event.sorts;
        // this could be optimized better since it will resort
        // the rows again on the 'push' detection...
        if (this.externalSorting === false) {
            // don't use normal setter so we don't resort
            this.sortInternalRows();
        }
        // auto group by parent on new update
        this._internalRows = groupRowsByParents(this._internalRows, optionalGetterForProp(this.treeFromRelation), optionalGetterForProp(this.treeToRelation));
        // Always go to first page when sorting to see the newly sorted data
        this.offset = 0;
        this.bodyComponent.updateOffsetY(this.offset);
        this.sort.emit(event);
    }
    /**
     * Toggle all row selection
     * @param {?} event
     * @return {?}
     */
    onHeaderSelect(event) {
        if (this.selectAllRowsOnPage) {
            // before we splice, chk if we currently have all selected
            /** @type {?} */
            const first = this.bodyComponent.indexes.first;
            /** @type {?} */
            const last = this.bodyComponent.indexes.last;
            /** @type {?} */
            const allSelected = this.selected.length === last - first;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                this.selected.push(...this._internalRows.slice(first, last));
            }
        }
        else {
            // before we splice, chk if we currently have all selected
            /** @type {?} */
            const allSelected = this.selected.length === this.rows.length;
            // remove all existing either way
            this.selected = [];
            // do the opposite here
            if (!allSelected) {
                this.selected.push(...this.rows);
            }
        }
        this.select.emit({
            selected: this.selected
        });
    }
    /**
     * A row was selected from body
     * @param {?} event
     * @return {?}
     */
    onBodySelect(event) {
        this.select.emit(event);
    }
    /**
     * A row was expanded or collapsed for tree
     * @param {?} event
     * @return {?}
     */
    onTreeAction(event) {
        /** @type {?} */
        const row = event.row;
        // TODO: For duplicated items this will not work
        /** @type {?} */
        const rowIndex = this._rows.findIndex((/**
         * @param {?} r
         * @return {?}
         */
        r => r[this.treeToRelation] === event.row[this.treeToRelation]));
        this.treeAction.emit({ row, rowIndex });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._subscriptions.forEach((/**
         * @param {?} subscription
         * @return {?}
         */
        subscription => subscription.unsubscribe()));
    }
    /**
     * listen for changes to input bindings of all DataTableColumnDirective and
     * trigger the columnTemplates.changes observable to emit
     * @private
     * @return {?}
     */
    listenForColumnInputChanges() {
        this._subscriptions.push(this.columnChangesService.columnInputChanges$.subscribe((/**
         * @return {?}
         */
        () => {
            if (this.columnTemplates) {
                this.columnTemplates.notifyOnChanges();
            }
        })));
    }
    /**
     * @private
     * @return {?}
     */
    sortInternalRows() {
        this._internalRows = sortRows(this._internalRows, this._internalColumns, this.sorts);
    }
}
DatatableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-datatable',
                template: "<div visibilityObserver (visible)=\"recalculate()\">\n  <datatable-header\n    *ngIf=\"headerHeight\"\n    [sorts]=\"sorts\"\n    [sortType]=\"sortType\"\n    [scrollbarH]=\"scrollbarH\"\n    [innerWidth]=\"_innerWidth\"\n    [offsetX]=\"_offsetX | async\"\n    [dealsWithGroup]=\"groupedRows !== undefined\"\n    [columns]=\"_internalColumns\"\n    [headerHeight]=\"headerHeight\"\n    [reorderable]=\"reorderable\"\n    [targetMarkerTemplate]=\"targetMarkerTemplate\"\n    [sortAscendingIcon]=\"cssClasses.sortAscending\"\n    [sortDescendingIcon]=\"cssClasses.sortDescending\"\n    [allRowsSelected]=\"allRowsSelected\"\n    [selectionType]=\"selectionType\"\n    (sort)=\"onColumnSort($event)\"\n    (resize)=\"onColumnResize($event)\"\n    (reorder)=\"onColumnReorder($event)\"\n    (select)=\"onHeaderSelect($event)\"\n    (columnContextmenu)=\"onColumnContextmenu($event)\"\n  >\n  </datatable-header>\n  <datatable-body\n    [groupRowsBy]=\"groupRowsBy\"\n    [groupedRows]=\"groupedRows\"\n    [rows]=\"_internalRows\"\n    [groupExpansionDefault]=\"groupExpansionDefault\"\n    [scrollbarV]=\"scrollbarV\"\n    [scrollbarH]=\"scrollbarH\"\n    [virtualization]=\"virtualization\"\n    [loadingIndicator]=\"loadingIndicator\"\n    [externalPaging]=\"externalPaging\"\n    [rowHeight]=\"rowHeight\"\n    [rowCount]=\"rowCount\"\n    [offset]=\"offset\"\n    [trackByProp]=\"trackByProp\"\n    [columns]=\"_internalColumns\"\n    [pageSize]=\"pageSize\"\n    [offsetX]=\"_offsetX | async\"\n    [rowDetail]=\"rowDetail\"\n    [groupHeader]=\"groupHeader\"\n    [selected]=\"selected\"\n    [innerWidth]=\"_innerWidth\"\n    [bodyHeight]=\"bodyHeight\"\n    [selectionType]=\"selectionType\"\n    [emptyMessage]=\"messages.emptyMessage\"\n    [rowIdentity]=\"rowIdentity\"\n    [rowClass]=\"rowClass\"\n    [selectCheck]=\"selectCheck\"\n    [displayCheck]=\"displayCheck\"\n    [summaryRow]=\"summaryRow\"\n    [summaryHeight]=\"summaryHeight\"\n    [summaryPosition]=\"summaryPosition\"\n    (page)=\"onBodyPage($event)\"\n    (activate)=\"activate.emit($event)\"\n    (rowContextmenu)=\"onRowContextmenu($event)\"\n    (rowInited)=\"onRowInited($event)\"\n    (select)=\"onBodySelect($event)\"\n    (scroll)=\"onBodyScroll($event)\"\n    (treeAction)=\"onTreeAction($event)\"\n  >\n  </datatable-body>\n  <datatable-footer\n    *ngIf=\"footerHeight\"\n    [rowCount]=\"rowCount\"\n    [pageSize]=\"pageSize\"\n    [offset]=\"offset\"\n    [footerHeight]=\"footerHeight\"\n    [footerTemplate]=\"footer\"\n    [totalMessage]=\"messages.totalMessage\"\n    [pagerLeftArrowIcon]=\"cssClasses.pagerLeftArrow\"\n    [pagerRightArrowIcon]=\"cssClasses.pagerRightArrow\"\n    [pagerPreviousIcon]=\"cssClasses.pagerPrevious\"\n    [selectedCount]=\"selected.length\"\n    [selectedMessage]=\"!!selectionType && messages.selectedMessage\"\n    [pagerNextIcon]=\"cssClasses.pagerNext\"\n    (page)=\"onFooterPage($event)\"\n  >\n  </datatable-footer>\n</div>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    class: 'ngx-datatable'
                },
                styles: [".ngx-datatable{display:block;overflow:hidden;-webkit-box-pack:center;justify-content:center;position:relative;-webkit-transform:translate3d(0,0,0)}.ngx-datatable [hidden]{display:none!important}.ngx-datatable *,.ngx-datatable :after,.ngx-datatable :before{box-sizing:border-box}.ngx-datatable.scroll-vertical .datatable-body{overflow-y:auto}.ngx-datatable.scroll-vertical.virtualized .datatable-body .datatable-row-wrapper{position:absolute}.ngx-datatable.scroll-horz .datatable-body{overflow-x:auto;-webkit-overflow-scrolling:touch}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner{white-space:nowrap}.ngx-datatable.fixed-header .datatable-header .datatable-header-inner .datatable-header-cell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ngx-datatable.fixed-row .datatable-scroll,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row{white-space:nowrap}.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-cell,.ngx-datatable.fixed-row .datatable-scroll .datatable-body-row .datatable-body-group-cell{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ngx-datatable .datatable-body-row,.ngx-datatable .datatable-header-inner,.ngx-datatable .datatable-row-center{display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;-o-flex-flow:row;flex-flow:row}.ngx-datatable .datatable-body-cell,.ngx-datatable .datatable-header-cell{overflow-x:hidden;vertical-align:top;display:inline-block;line-height:1.625}.ngx-datatable .datatable-body-cell:focus,.ngx-datatable .datatable-header-cell:focus{outline:0}.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{z-index:9}.ngx-datatable .datatable-row-center,.ngx-datatable .datatable-row-group,.ngx-datatable .datatable-row-left,.ngx-datatable .datatable-row-right{position:relative}.ngx-datatable .datatable-header{display:block;overflow:hidden}.ngx-datatable .datatable-header .datatable-header-inner{-webkit-box-align:stretch;align-items:stretch;-webkit-align-items:stretch}.ngx-datatable .datatable-header .datatable-header-cell{position:relative;display:inline-block}.ngx-datatable .datatable-header .datatable-header-cell.sortable .datatable-header-cell-wrapper{cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell.longpress .datatable-header-cell-wrapper{cursor:move}.ngx-datatable .datatable-header .datatable-header-cell .sort-btn{line-height:100%;vertical-align:middle;display:inline-block;cursor:pointer}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell .resize-handle--not-resizable{display:inline-block;position:absolute;right:0;top:0;bottom:0;width:5px;padding:0 4px;visibility:hidden}.ngx-datatable .datatable-header .datatable-header-cell .resize-handle{cursor:ew-resize}.ngx-datatable .datatable-header .datatable-header-cell.resizeable:hover .resize-handle,.ngx-datatable .datatable-header .datatable-header-cell:hover .resize-handle--not-resizable{visibility:visible}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker{position:absolute;top:0;bottom:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromLeft{right:0}.ngx-datatable .datatable-header .datatable-header-cell .targetMarker.dragFromRight{left:0}.ngx-datatable .datatable-header .datatable-header-cell .datatable-header-cell-template-wrap{height:inherit}.ngx-datatable .datatable-body{position:relative;z-index:10;display:block}.ngx-datatable .datatable-body .datatable-scroll{display:inline-block}.ngx-datatable .datatable-body .datatable-row-detail{overflow-y:hidden}.ngx-datatable .datatable-body .datatable-row-wrapper{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column}.ngx-datatable .datatable-body .datatable-body-row{outline:0}.ngx-datatable .datatable-body .datatable-body-row>div{display:-webkit-box;display:flex}.ngx-datatable .datatable-footer{display:block;width:100%;overflow:auto}.ngx-datatable .datatable-footer .datatable-footer-inner{display:-webkit-box;display:flex;-webkit-box-align:center;align-items:center;width:100%}.ngx-datatable .datatable-footer .selected-count .page-count{-webkit-box-flex:1;flex:1 1 40%}.ngx-datatable .datatable-footer .selected-count .datatable-pager{-webkit-box-flex:1;flex:1 1 60%}.ngx-datatable .datatable-footer .page-count{-webkit-box-flex:1;flex:1 1 20%}.ngx-datatable .datatable-footer .datatable-pager{-webkit-box-flex:1;flex:1 1 80%;text-align:right}.ngx-datatable .datatable-footer .datatable-pager .pager,.ngx-datatable .datatable-footer .datatable-pager .pager li{padding:0;margin:0;display:inline-block;list-style:none}.ngx-datatable .datatable-footer .datatable-pager .pager li,.ngx-datatable .datatable-footer .datatable-pager .pager li a{outline:0}.ngx-datatable .datatable-footer .datatable-pager .pager li a{cursor:pointer;display:inline-block}.ngx-datatable .datatable-footer .datatable-pager .pager li.disabled a{cursor:not-allowed}"]
            }] }
];
/** @nocollapse */
DatatableComponent.ctorParameters = () => [
    { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
    { type: DimensionsHelper, decorators: [{ type: SkipSelf }] },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: KeyValueDiffers },
    { type: ColumnChangesService },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['configuration',] }] }
];
DatatableComponent.propDecorators = {
    targetMarkerTemplate: [{ type: Input }],
    rows: [{ type: Input }],
    groupRowsBy: [{ type: Input }],
    groupedRows: [{ type: Input }],
    columns: [{ type: Input }],
    selected: [{ type: Input }],
    scrollbarV: [{ type: Input }],
    scrollbarH: [{ type: Input }],
    rowHeight: [{ type: Input }],
    columnMode: [{ type: Input }],
    headerHeight: [{ type: Input }],
    footerHeight: [{ type: Input }],
    externalPaging: [{ type: Input }],
    externalSorting: [{ type: Input }],
    limit: [{ type: Input }],
    count: [{ type: Input }],
    offset: [{ type: Input }],
    loadingIndicator: [{ type: Input }],
    selectionType: [{ type: Input }],
    reorderable: [{ type: Input }],
    swapColumns: [{ type: Input }],
    sortType: [{ type: Input }],
    sorts: [{ type: Input }],
    cssClasses: [{ type: Input }],
    messages: [{ type: Input }],
    rowClass: [{ type: Input }],
    selectCheck: [{ type: Input }],
    displayCheck: [{ type: Input }],
    groupExpansionDefault: [{ type: Input }],
    trackByProp: [{ type: Input }],
    selectAllRowsOnPage: [{ type: Input }],
    virtualization: [{ type: Input }],
    treeFromRelation: [{ type: Input }],
    treeToRelation: [{ type: Input }],
    summaryRow: [{ type: Input }],
    summaryHeight: [{ type: Input }],
    summaryPosition: [{ type: Input }],
    scroll: [{ type: Output }],
    rowInited: [{ type: Output }],
    activate: [{ type: Output }],
    select: [{ type: Output }],
    sort: [{ type: Output }],
    page: [{ type: Output }],
    reorder: [{ type: Output }],
    resize: [{ type: Output }],
    tableContextmenu: [{ type: Output }],
    tableRowAdded: [{ type: Output }],
    treeAction: [{ type: Output }],
    isFixedHeader: [{ type: HostBinding, args: ['class.fixed-header',] }],
    isFixedRow: [{ type: HostBinding, args: ['class.fixed-row',] }],
    isVertScroll: [{ type: HostBinding, args: ['class.scroll-vertical',] }],
    isVirtualized: [{ type: HostBinding, args: ['class.virtualized',] }],
    isHorScroll: [{ type: HostBinding, args: ['class.scroll-horz',] }],
    isSelectable: [{ type: HostBinding, args: ['class.selectable',] }],
    isCheckboxSelection: [{ type: HostBinding, args: ['class.checkbox-selection',] }],
    isCellSelection: [{ type: HostBinding, args: ['class.cell-selection',] }],
    isSingleSelection: [{ type: HostBinding, args: ['class.single-selection',] }],
    isMultiSelection: [{ type: HostBinding, args: ['class.multi-selection',] }],
    isMultiClickSelection: [{ type: HostBinding, args: ['class.multi-click-selection',] }],
    columnTemplates: [{ type: ContentChildren, args: [DataTableColumnDirective,] }],
    rowDetail: [{ type: ContentChild, args: [DatatableRowDetailDirective, { static: false },] }],
    groupHeader: [{ type: ContentChild, args: [DatatableGroupHeaderDirective, { static: false },] }],
    footer: [{ type: ContentChild, args: [DatatableFooterDirective, { static: false },] }],
    bodyComponent: [{ type: ViewChild, args: [DataTableBodyComponent, { static: false },] }],
    headerComponent: [{ type: ViewChild, args: [DataTableHeaderComponent, { static: false },] }],
    rowIdentity: [{ type: Input }],
    onWindowResize: [{ type: HostListener, args: ['window:resize',] }]
};
tslib_1.__decorate([
    throttleable(5),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], DatatableComponent.prototype, "onWindowResize", null);
if (false) {
    /**
     * Template for the target marker of drag target columns.
     * @type {?}
     */
    DatatableComponent.prototype.targetMarkerTemplate;
    /**
     * This attribute allows the user to set a grouped array in the following format:
     *  [
     *    {groupid=1} [
     *      {id=1 name="test1"},
     *      {id=2 name="test2"},
     *      {id=3 name="test3"}
     *    ]},
     *    {groupid=2>[
     *      {id=4 name="test4"},
     *      {id=5 name="test5"},
     *      {id=6 name="test6"}
     *    ]}
     *  ]
     * @type {?}
     */
    DatatableComponent.prototype.groupedRows;
    /**
     * List of row objects that should be
     * represented as selected in the grid.
     * Default value: `[]`
     * @type {?}
     */
    DatatableComponent.prototype.selected;
    /**
     * Enable vertical scrollbars
     * @type {?}
     */
    DatatableComponent.prototype.scrollbarV;
    /**
     * Enable horz scrollbars
     * @type {?}
     */
    DatatableComponent.prototype.scrollbarH;
    /**
     * The row height; which is necessary
     * to calculate the height for the lazy rendering.
     * @type {?}
     */
    DatatableComponent.prototype.rowHeight;
    /**
     * Type of column width distribution formula.
     * Example: flex, force, standard
     * @type {?}
     */
    DatatableComponent.prototype.columnMode;
    /**
     * The minimum header height in pixels.
     * Pass a falsey for no header
     * @type {?}
     */
    DatatableComponent.prototype.headerHeight;
    /**
     * The minimum footer height in pixels.
     * Pass falsey for no footer
     * @type {?}
     */
    DatatableComponent.prototype.footerHeight;
    /**
     * If the table should use external paging
     * otherwise its assumed that all data is preloaded.
     * @type {?}
     */
    DatatableComponent.prototype.externalPaging;
    /**
     * If the table should use external sorting or
     * the built-in basic sorting.
     * @type {?}
     */
    DatatableComponent.prototype.externalSorting;
    /**
     * Show the linear loading bar.
     * Default value: `false`
     * @type {?}
     */
    DatatableComponent.prototype.loadingIndicator;
    /**
     * Type of row selection. Options are:
     *
     *  - `single`
     *  - `multi`
     *  - `checkbox`
     *  - `multiClick`
     *  - `cell`
     *
     * For no selection pass a `falsey`.
     * Default value: `undefined`
     * @type {?}
     */
    DatatableComponent.prototype.selectionType;
    /**
     * Enable/Disable ability to re-order columns
     * by dragging them.
     * @type {?}
     */
    DatatableComponent.prototype.reorderable;
    /**
     * Swap columns on re-order columns or
     * move them.
     * @type {?}
     */
    DatatableComponent.prototype.swapColumns;
    /**
     * The type of sorting
     * @type {?}
     */
    DatatableComponent.prototype.sortType;
    /**
     * Array of sorted columns by property and type.
     * Default value: `[]`
     * @type {?}
     */
    DatatableComponent.prototype.sorts;
    /**
     * Css class overrides
     * @type {?}
     */
    DatatableComponent.prototype.cssClasses;
    /**
     * Message overrides for localization
     *
     * emptyMessage     [default] = 'No data to display'
     * totalMessage     [default] = 'total'
     * selectedMessage  [default] = 'selected'
     * @type {?}
     */
    DatatableComponent.prototype.messages;
    /**
     * Row specific classes.
     * Similar implementation to ngClass.
     *
     *  [rowClass]="'first second'"
     *  [rowClass]="{ 'first': true, 'second': true, 'third': false }"
     * @type {?}
     */
    DatatableComponent.prototype.rowClass;
    /**
     * A boolean/function you can use to check whether you want
     * to select a particular row based on a criteria. Example:
     *
     *    (selection) => {
     *      return selection !== 'Ethel Price';
     *    }
     * @type {?}
     */
    DatatableComponent.prototype.selectCheck;
    /**
     * A function you can use to check whether you want
     * to show the checkbox for a particular row based on a criteria. Example:
     *
     *    (row, column, value) => {
     *      return row.name !== 'Ethel Price';
     *    }
     * @type {?}
     */
    DatatableComponent.prototype.displayCheck;
    /**
     * A boolean you can use to set the detault behaviour of rows and groups
     * whether they will start expanded or not. If ommited the default is NOT expanded.
     *
     * @type {?}
     */
    DatatableComponent.prototype.groupExpansionDefault;
    /**
     * Property to which you can use for custom tracking of rows.
     * Example: 'name'
     * @type {?}
     */
    DatatableComponent.prototype.trackByProp;
    /**
     * Property to which you can use for determining select all
     * rows on current page or not.
     *
     * \@memberOf DatatableComponent
     * @type {?}
     */
    DatatableComponent.prototype.selectAllRowsOnPage;
    /**
     * A flag for row virtualization on / off
     * @type {?}
     */
    DatatableComponent.prototype.virtualization;
    /**
     * Tree from relation
     * @type {?}
     */
    DatatableComponent.prototype.treeFromRelation;
    /**
     * Tree to relation
     * @type {?}
     */
    DatatableComponent.prototype.treeToRelation;
    /**
     * A flag for switching summary row on / off
     * @type {?}
     */
    DatatableComponent.prototype.summaryRow;
    /**
     * A height of summary row
     * @type {?}
     */
    DatatableComponent.prototype.summaryHeight;
    /**
     * A property holds a summary row position: top/bottom
     * @type {?}
     */
    DatatableComponent.prototype.summaryPosition;
    /**
     * Body was scrolled typically in a `scrollbarV:true` scenario.
     * @type {?}
     */
    DatatableComponent.prototype.scroll;
    /**
     * A row was added
     * @type {?}
     */
    DatatableComponent.prototype.rowInited;
    /**
     * A cell or row was focused via keyboard or mouse click.
     * @type {?}
     */
    DatatableComponent.prototype.activate;
    /**
     * A cell or row was selected.
     * @type {?}
     */
    DatatableComponent.prototype.select;
    /**
     * Column sort was invoked.
     * @type {?}
     */
    DatatableComponent.prototype.sort;
    /**
     * The table was paged either triggered by the pager or the body scroll.
     * @type {?}
     */
    DatatableComponent.prototype.page;
    /**
     * Columns were re-ordered.
     * @type {?}
     */
    DatatableComponent.prototype.reorder;
    /**
     * Column was resized.
     * @type {?}
     */
    DatatableComponent.prototype.resize;
    /**
     * The context menu was invoked on the table.
     * type indicates whether the header or the body was clicked.
     * content contains either the column or the row that was clicked.
     * @type {?}
     */
    DatatableComponent.prototype.tableContextmenu;
    /** @type {?} */
    DatatableComponent.prototype.tableRowAdded;
    /**
     * A row was expanded ot collapsed for tree
     * @type {?}
     */
    DatatableComponent.prototype.treeAction;
    /**
     * Row Detail templates gathered from the ContentChild
     * @type {?}
     */
    DatatableComponent.prototype.rowDetail;
    /**
     * Group Header templates gathered from the ContentChild
     * @type {?}
     */
    DatatableComponent.prototype.groupHeader;
    /**
     * Footer template gathered from the ContentChild
     * @type {?}
     */
    DatatableComponent.prototype.footer;
    /**
     * Reference to the body component for manually
     * invoking functions on the body.
     * @type {?}
     */
    DatatableComponent.prototype.bodyComponent;
    /**
     * Reference to the header component for manually
     * invoking functions on the header.
     *
     * \@memberOf DatatableComponent
     * @type {?}
     */
    DatatableComponent.prototype.headerComponent;
    /** @type {?} */
    DatatableComponent.prototype.element;
    /** @type {?} */
    DatatableComponent.prototype._innerWidth;
    /** @type {?} */
    DatatableComponent.prototype.pageSize;
    /** @type {?} */
    DatatableComponent.prototype.bodyHeight;
    /** @type {?} */
    DatatableComponent.prototype.rowCount;
    /** @type {?} */
    DatatableComponent.prototype.rowDiffer;
    /** @type {?} */
    DatatableComponent.prototype._offsetX;
    /** @type {?} */
    DatatableComponent.prototype._limit;
    /** @type {?} */
    DatatableComponent.prototype._count;
    /** @type {?} */
    DatatableComponent.prototype._offset;
    /** @type {?} */
    DatatableComponent.prototype._rows;
    /** @type {?} */
    DatatableComponent.prototype._groupRowsBy;
    /** @type {?} */
    DatatableComponent.prototype._internalRows;
    /** @type {?} */
    DatatableComponent.prototype._internalRowsHash;
    /** @type {?} */
    DatatableComponent.prototype._internalColumns;
    /** @type {?} */
    DatatableComponent.prototype._columns;
    /** @type {?} */
    DatatableComponent.prototype._columnTemplates;
    /** @type {?} */
    DatatableComponent.prototype._subscriptions;
    /**
     * This will be used when displaying or selecting rows.
     * when tracking/comparing them, we'll use the value of this fn,
     *
     * (`fn(x) === fn(y)` instead of `x === y`)
     * @type {?}
     */
    DatatableComponent.prototype.rowIdentity;
    /**
     * @type {?}
     * @private
     */
    DatatableComponent.prototype.scrollbarHelper;
    /**
     * @type {?}
     * @private
     */
    DatatableComponent.prototype.dimensionsHelper;
    /**
     * @type {?}
     * @private
     */
    DatatableComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    DatatableComponent.prototype.columnChangesService;
    /**
     * @type {?}
     * @private
     */
    DatatableComponent.prototype.configuration;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXRhYmxlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bzd2ltbGFuZS9uZ3gtZGF0YXRhYmxlLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZGF0YXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUVmLFNBQVMsRUFFVCxXQUFXLEVBQ1gsWUFBWSxFQUVaLGVBQWUsRUFFZixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixRQUFRLEVBRVIsUUFBUSxFQUNSLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVuRixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JF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SzNDLG9DQUNpQzs7Ozs7O0lBTWpDLDJDQUNzQzs7Ozs7Ozs7SUFRdEMsNkNBQzBDOztJQWlCMUMscUNBQXFCOztJQUNyQix5Q0FBb0I7O0lBQ3BCLHNDQUFpQjs7SUFDakIsd0NBQW1COztJQUNuQixzQ0FBcUI7O0lBQ3JCLHVDQUFrQzs7SUFFbEMsc0NBQWtDOztJQUNsQyxvQ0FBMkI7O0lBQzNCLG9DQUFtQjs7SUFDbkIscUNBQW9COztJQUNwQixtQ0FBYTs7SUFDYiwwQ0FBcUI7O0lBQ3JCLDJDQUFxQjs7SUFDckIsK0NBQXNCOztJQUN0Qiw4Q0FBZ0M7O0lBQ2hDLHNDQUF3Qjs7SUFDeEIsOENBQXNEOztJQUN0RCw0Q0FBb0M7Ozs7Ozs7O0lBMkJwQyx5Q0FBc0Q7Ozs7O0lBeEJwRCw2Q0FBb0Q7Ozs7O0lBQ3BELDhDQUFzRDs7Ozs7SUFDdEQsZ0NBQTZCOzs7OztJQUc3QixrREFBa0Q7Ozs7O0lBQ2xELDJDQUErRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBWaWV3Q2hpbGQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgQ29udGVudENoaWxkcmVuLFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgSG9zdEJpbmRpbmcsXG4gIENvbnRlbnRDaGlsZCxcbiAgRG9DaGVjayxcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgU2tpcFNlbGYsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRGF0YXRhYmxlR3JvdXBIZWFkZXJEaXJlY3RpdmUgfSBmcm9tICcuL2JvZHkvYm9keS1ncm91cC1oZWFkZXIuZGlyZWN0aXZlJztcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElOZ3hEYXRhdGFibGVDb25maWcgfSBmcm9tICcuLi9uZ3gtZGF0YXRhYmxlLm1vZHVsZSc7XG5pbXBvcnQgeyBncm91cFJvd3NCeVBhcmVudHMsIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCB9IGZyb20gJy4uL3V0aWxzL3RyZWUnO1xuaW1wb3J0IHsgVGFibGVDb2x1bW4gfSBmcm9tICcuLi90eXBlcy90YWJsZS1jb2x1bW4udHlwZSc7XG5pbXBvcnQgeyBzZXRDb2x1bW5EZWZhdWx0cywgdHJhbnNsYXRlVGVtcGxhdGVzIH0gZnJvbSAnLi4vdXRpbHMvY29sdW1uLWhlbHBlcic7XG5pbXBvcnQgeyBDb2x1bW5Nb2RlIH0gZnJvbSAnLi4vdHlwZXMvY29sdW1uLW1vZGUudHlwZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvc2VsZWN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgU29ydFR5cGUgfSBmcm9tICcuLi90eXBlcy9zb3J0LnR5cGUnO1xuaW1wb3J0IHsgQ29udGV4dG1lbnVUeXBlIH0gZnJvbSAnLi4vdHlwZXMvY29udGV4dG1lbnUudHlwZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbnMvY29sdW1uLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmUgfSBmcm9tICcuL3Jvdy1kZXRhaWwvcm93LWRldGFpbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9mb290ZXIvZm9vdGVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhVGFibGVCb2R5Q29tcG9uZW50IH0gZnJvbSAnLi9ib2R5L2JvZHkuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGFUYWJsZUhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vaGVhZGVyL2hlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2Nyb2xsYmFySGVscGVyIH0gZnJvbSAnLi4vc2VydmljZXMvc2Nyb2xsYmFyLWhlbHBlci5zZXJ2aWNlJztcbmltcG9ydCB7IENvbHVtbkNoYW5nZXNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvY29sdW1uLWNoYW5nZXMuc2VydmljZSc7XG5pbXBvcnQgeyBEaW1lbnNpb25zSGVscGVyIH0gZnJvbSAnLi4vc2VydmljZXMvZGltZW5zaW9ucy1oZWxwZXIuc2VydmljZSc7XG5pbXBvcnQgeyB0aHJvdHRsZWFibGUgfSBmcm9tICcuLi91dGlscy90aHJvdHRsZSc7XG5pbXBvcnQgeyBmb3JjZUZpbGxDb2x1bW5XaWR0aHMsIGFkanVzdENvbHVtbldpZHRocyB9IGZyb20gJy4uL3V0aWxzL21hdGgnO1xuaW1wb3J0IHsgc29ydFJvd3MgfSBmcm9tICcuLi91dGlscy9zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWRhdGF0YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRhdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0YXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25neC1kYXRhdGFibGUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRGF0YXRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcbiAgLyoqXG4gICAqIFRlbXBsYXRlIGZvciB0aGUgdGFyZ2V0IG1hcmtlciBvZiBkcmFnIHRhcmdldCBjb2x1bW5zLlxuICAgKi9cbiAgQElucHV0KCkgdGFyZ2V0TWFya2VyVGVtcGxhdGU6IGFueTtcblxuICAvKipcbiAgICogUm93cyB0aGF0IGFyZSBkaXNwbGF5ZWQgaW4gdGhlIHRhYmxlLlxuICAgKi9cbiAgQElucHV0KCkgc2V0IHJvd3ModmFsOiBhbnkpIHtcbiAgICB0aGlzLl9yb3dzID0gdmFsO1xuXG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzID0gWy4uLnZhbF07XG4gICAgfVxuXG4gICAgLy8gYXV0byBzb3J0IG9uIG5ldyB1cGRhdGVzXG4gICAgaWYgKCF0aGlzLmV4dGVybmFsU29ydGluZykge1xuICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgfVxuXG4gICAgLy8gYXV0byBncm91cCBieSBwYXJlbnQgb24gbmV3IHVwZGF0ZVxuICAgIHRoaXMuX2ludGVybmFsUm93cyA9IGdyb3VwUm93c0J5UGFyZW50cyhcbiAgICAgIHRoaXMuX2ludGVybmFsUm93cyxcbiAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVGcm9tUmVsYXRpb24pLFxuICAgICAgb3B0aW9uYWxHZXR0ZXJGb3JQcm9wKHRoaXMudHJlZVRvUmVsYXRpb24pXG4gICAgKTtcblxuICAgIC8vIHJlY2FsY3VsYXRlIHNpemVzL2V0Y1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcblxuICAgIGlmICh0aGlzLl9yb3dzICYmIHRoaXMuX2dyb3VwUm93c0J5KSB7XG4gICAgICAvLyBJZiBhIGNvbHVtbiBoYXMgYmVlbiBzcGVjaWZpZWQgaW4gX2dyb3VwUm93c0J5IGNyZWF0ZWQgYSBuZXcgYXJyYXkgd2l0aCB0aGUgZGF0YSBncm91cGVkIGJ5IHRoYXQgcm93XG4gICAgICB0aGlzLmdyb3VwZWRSb3dzID0gdGhpcy5ncm91cEFycmF5QnkodGhpcy5fcm93cywgdGhpcy5fZ3JvdXBSb3dzQnkpO1xuICAgIH1cblxuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgcm93cy5cbiAgICovXG4gIGdldCByb3dzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBhdHRyaWJ1dGUgYWxsb3dzIHRoZSB1c2VyIHRvIHNldCB0aGUgbmFtZSBvZiB0aGUgY29sdW1uIHRvIGdyb3VwIHRoZSBkYXRhIHdpdGhcbiAgICovXG4gIEBJbnB1dCgpIHNldCBncm91cFJvd3NCeSh2YWw6IHN0cmluZykge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMuX2dyb3VwUm93c0J5ID0gdmFsO1xuICAgICAgaWYgKHRoaXMuX3Jvd3MgJiYgdGhpcy5fZ3JvdXBSb3dzQnkpIHtcbiAgICAgICAgLy8gY3JldGVzIGEgbmV3IGFycmF5IHdpdGggdGhlIGRhdGEgZ3JvdXBlZFxuICAgICAgICB0aGlzLmdyb3VwZWRSb3dzID0gdGhpcy5ncm91cEFycmF5QnkodGhpcy5fcm93cywgdGhpcy5fZ3JvdXBSb3dzQnkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBncm91cFJvd3NCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JvdXBSb3dzQnk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBhdHRyaWJ1dGUgYWxsb3dzIHRoZSB1c2VyIHRvIHNldCBhIGdyb3VwZWQgYXJyYXkgaW4gdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gICAqICBbXG4gICAqICAgIHtncm91cGlkPTF9IFtcbiAgICogICAgICB7aWQ9MSBuYW1lPVwidGVzdDFcIn0sXG4gICAqICAgICAge2lkPTIgbmFtZT1cInRlc3QyXCJ9LFxuICAgKiAgICAgIHtpZD0zIG5hbWU9XCJ0ZXN0M1wifVxuICAgKiAgICBdfSxcbiAgICogICAge2dyb3VwaWQ9Mj5bXG4gICAqICAgICAge2lkPTQgbmFtZT1cInRlc3Q0XCJ9LFxuICAgKiAgICAgIHtpZD01IG5hbWU9XCJ0ZXN0NVwifSxcbiAgICogICAgICB7aWQ9NiBuYW1lPVwidGVzdDZcIn1cbiAgICogICAgXX1cbiAgICogIF1cbiAgICovXG4gIEBJbnB1dCgpIGdyb3VwZWRSb3dzOiBhbnlbXTtcblxuICAvKipcbiAgICogQ29sdW1ucyB0byBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBASW5wdXQoKSBzZXQgY29sdW1ucyh2YWw6IFRhYmxlQ29sdW1uW10pIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSBbLi4udmFsXTtcbiAgICAgIHNldENvbHVtbkRlZmF1bHRzKHRoaXMuX2ludGVybmFsQ29sdW1ucyk7XG4gICAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb2x1bW5zLlxuICAgKi9cbiAgZ2V0IGNvbHVtbnMoKTogVGFibGVDb2x1bW5bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XG4gIH1cblxuICAvKipcbiAgICogTGlzdCBvZiByb3cgb2JqZWN0cyB0aGF0IHNob3VsZCBiZVxuICAgKiByZXByZXNlbnRlZCBhcyBzZWxlY3RlZCBpbiB0aGUgZ3JpZC5cbiAgICogRGVmYXVsdCB2YWx1ZTogYFtdYFxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdID0gW107XG5cbiAgLyoqXG4gICAqIEVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGxiYXJzXG4gICAqL1xuICBASW5wdXQoKSBzY3JvbGxiYXJWOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBob3J6IHNjcm9sbGJhcnNcbiAgICovXG4gIEBJbnB1dCgpIHNjcm9sbGJhckg6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHJvdyBoZWlnaHQ7IHdoaWNoIGlzIG5lY2Vzc2FyeVxuICAgKiB0byBjYWxjdWxhdGUgdGhlIGhlaWdodCBmb3IgdGhlIGxhenkgcmVuZGVyaW5nLlxuICAgKi9cbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAnYXV0bycgfCAoKHJvdz86IGFueSkgPT4gbnVtYmVyKSA9IDMwO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGNvbHVtbiB3aWR0aCBkaXN0cmlidXRpb24gZm9ybXVsYS5cbiAgICogRXhhbXBsZTogZmxleCwgZm9yY2UsIHN0YW5kYXJkXG4gICAqL1xuICBASW5wdXQoKSBjb2x1bW5Nb2RlOiBDb2x1bW5Nb2RlID0gQ29sdW1uTW9kZS5zdGFuZGFyZDtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gaGVhZGVyIGhlaWdodCBpbiBwaXhlbHMuXG4gICAqIFBhc3MgYSBmYWxzZXkgZm9yIG5vIGhlYWRlclxuICAgKi9cbiAgQElucHV0KCkgaGVhZGVySGVpZ2h0OiBhbnkgPSAzMDtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gZm9vdGVyIGhlaWdodCBpbiBwaXhlbHMuXG4gICAqIFBhc3MgZmFsc2V5IGZvciBubyBmb290ZXJcbiAgICovXG4gIEBJbnB1dCgpIGZvb3RlckhlaWdodDogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogSWYgdGhlIHRhYmxlIHNob3VsZCB1c2UgZXh0ZXJuYWwgcGFnaW5nXG4gICAqIG90aGVyd2lzZSBpdHMgYXNzdW1lZCB0aGF0IGFsbCBkYXRhIGlzIHByZWxvYWRlZC5cbiAgICovXG4gIEBJbnB1dCgpIGV4dGVybmFsUGFnaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElmIHRoZSB0YWJsZSBzaG91bGQgdXNlIGV4dGVybmFsIHNvcnRpbmcgb3JcbiAgICogdGhlIGJ1aWx0LWluIGJhc2ljIHNvcnRpbmcuXG4gICAqL1xuICBASW5wdXQoKSBleHRlcm5hbFNvcnRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIHBhZ2Ugc2l6ZSB0byBiZSBzaG93bi5cbiAgICogRGVmYXVsdCB2YWx1ZTogYHVuZGVmaW5lZGBcbiAgICovXG4gIEBJbnB1dCgpIHNldCBsaW1pdCh2YWw6IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2xpbWl0ID0gdmFsO1xuXG4gICAgLy8gcmVjYWxjdWxhdGUgc2l6ZXMvZXRjXG4gICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxpbWl0LlxuICAgKi9cbiAgZ2V0IGxpbWl0KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2xpbWl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBjb3VudCBvZiBhbGwgcm93cy5cbiAgICogRGVmYXVsdCB2YWx1ZTogYDBgXG4gICAqL1xuICBASW5wdXQoKSBzZXQgY291bnQodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb3VudCA9IHZhbDtcblxuICAgIC8vIHJlY2FsY3VsYXRlIHNpemVzL2V0Y1xuICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjb3VudC5cbiAgICovXG4gIGdldCBjb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBvZmZzZXQgKCBwYWdlIC0gMSApIHNob3duLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgMGBcbiAgICovXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWw7XG4gIH1cbiAgZ2V0IG9mZnNldCgpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9vZmZzZXQsIE1hdGguY2VpbCh0aGlzLnJvd0NvdW50IC8gdGhpcy5wYWdlU2l6ZSkgLSAxKSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgbGluZWFyIGxvYWRpbmcgYmFyLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgZmFsc2VgXG4gICAqL1xuICBASW5wdXQoKSBsb2FkaW5nSW5kaWNhdG9yOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2Ygcm93IHNlbGVjdGlvbi4gT3B0aW9ucyBhcmU6XG4gICAqXG4gICAqICAtIGBzaW5nbGVgXG4gICAqICAtIGBtdWx0aWBcbiAgICogIC0gYGNoZWNrYm94YFxuICAgKiAgLSBgbXVsdGlDbGlja2BcbiAgICogIC0gYGNlbGxgXG4gICAqXG4gICAqIEZvciBubyBzZWxlY3Rpb24gcGFzcyBhIGBmYWxzZXlgLlxuICAgKiBEZWZhdWx0IHZhbHVlOiBgdW5kZWZpbmVkYFxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcblxuICAvKipcbiAgICogRW5hYmxlL0Rpc2FibGUgYWJpbGl0eSB0byByZS1vcmRlciBjb2x1bW5zXG4gICAqIGJ5IGRyYWdnaW5nIHRoZW0uXG4gICAqL1xuICBASW5wdXQoKSByZW9yZGVyYWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFN3YXAgY29sdW1ucyBvbiByZS1vcmRlciBjb2x1bW5zIG9yXG4gICAqIG1vdmUgdGhlbS5cbiAgICovXG4gIEBJbnB1dCgpIHN3YXBDb2x1bW5zOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2Ygc29ydGluZ1xuICAgKi9cbiAgQElucHV0KCkgc29ydFR5cGU6IFNvcnRUeXBlID0gU29ydFR5cGUuc2luZ2xlO1xuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBzb3J0ZWQgY29sdW1ucyBieSBwcm9wZXJ0eSBhbmQgdHlwZS5cbiAgICogRGVmYXVsdCB2YWx1ZTogYFtdYFxuICAgKi9cbiAgQElucHV0KCkgc29ydHM6IGFueVtdID0gW107XG5cbiAgLyoqXG4gICAqIENzcyBjbGFzcyBvdmVycmlkZXNcbiAgICovXG4gIEBJbnB1dCgpIGNzc0NsYXNzZXM6IGFueSA9IHtcbiAgICBzb3J0QXNjZW5kaW5nOiAnZGF0YXRhYmxlLWljb24tdXAnLFxuICAgIHNvcnREZXNjZW5kaW5nOiAnZGF0YXRhYmxlLWljb24tZG93bicsXG4gICAgcGFnZXJMZWZ0QXJyb3c6ICdkYXRhdGFibGUtaWNvbi1sZWZ0JyxcbiAgICBwYWdlclJpZ2h0QXJyb3c6ICdkYXRhdGFibGUtaWNvbi1yaWdodCcsXG4gICAgcGFnZXJQcmV2aW91czogJ2RhdGF0YWJsZS1pY29uLXByZXYnLFxuICAgIHBhZ2VyTmV4dDogJ2RhdGF0YWJsZS1pY29uLXNraXAnXG4gIH07XG5cbiAgLyoqXG4gICAqIE1lc3NhZ2Ugb3ZlcnJpZGVzIGZvciBsb2NhbGl6YXRpb25cbiAgICpcbiAgICogZW1wdHlNZXNzYWdlICAgICBbZGVmYXVsdF0gPSAnTm8gZGF0YSB0byBkaXNwbGF5J1xuICAgKiB0b3RhbE1lc3NhZ2UgICAgIFtkZWZhdWx0XSA9ICd0b3RhbCdcbiAgICogc2VsZWN0ZWRNZXNzYWdlICBbZGVmYXVsdF0gPSAnc2VsZWN0ZWQnXG4gICAqL1xuICBASW5wdXQoKSBtZXNzYWdlczogYW55ID0ge1xuICAgIC8vIE1lc3NhZ2UgdG8gc2hvdyB3aGVuIGFycmF5IGlzIHByZXNlbnRlZFxuICAgIC8vIGJ1dCBjb250YWlucyBubyB2YWx1ZXNcbiAgICBlbXB0eU1lc3NhZ2U6ICdObyBkYXRhIHRvIGRpc3BsYXknLFxuXG4gICAgLy8gRm9vdGVyIHRvdGFsIG1lc3NhZ2VcbiAgICB0b3RhbE1lc3NhZ2U6ICd0b3RhbCcsXG5cbiAgICAvLyBGb290ZXIgc2VsZWN0ZWQgbWVzc2FnZVxuICAgIHNlbGVjdGVkTWVzc2FnZTogJ3NlbGVjdGVkJ1xuICB9O1xuXG4gIC8qKlxuICAgKiBSb3cgc3BlY2lmaWMgY2xhc3Nlcy5cbiAgICogU2ltaWxhciBpbXBsZW1lbnRhdGlvbiB0byBuZ0NsYXNzLlxuICAgKlxuICAgKiAgW3Jvd0NsYXNzXT1cIidmaXJzdCBzZWNvbmQnXCJcbiAgICogIFtyb3dDbGFzc109XCJ7ICdmaXJzdCc6IHRydWUsICdzZWNvbmQnOiB0cnVlLCAndGhpcmQnOiBmYWxzZSB9XCJcbiAgICovXG4gIEBJbnB1dCgpIHJvd0NsYXNzOiBhbnk7XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbi9mdW5jdGlvbiB5b3UgY2FuIHVzZSB0byBjaGVjayB3aGV0aGVyIHlvdSB3YW50XG4gICAqIHRvIHNlbGVjdCBhIHBhcnRpY3VsYXIgcm93IGJhc2VkIG9uIGEgY3JpdGVyaWEuIEV4YW1wbGU6XG4gICAqXG4gICAqICAgIChzZWxlY3Rpb24pID0+IHtcbiAgICogICAgICByZXR1cm4gc2VsZWN0aW9uICE9PSAnRXRoZWwgUHJpY2UnO1xuICAgKiAgICB9XG4gICAqL1xuICBASW5wdXQoKSBzZWxlY3RDaGVjazogYW55O1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHlvdSBjYW4gdXNlIHRvIGNoZWNrIHdoZXRoZXIgeW91IHdhbnRcbiAgICogdG8gc2hvdyB0aGUgY2hlY2tib3ggZm9yIGEgcGFydGljdWxhciByb3cgYmFzZWQgb24gYSBjcml0ZXJpYS4gRXhhbXBsZTpcbiAgICpcbiAgICogICAgKHJvdywgY29sdW1uLCB2YWx1ZSkgPT4ge1xuICAgKiAgICAgIHJldHVybiByb3cubmFtZSAhPT0gJ0V0aGVsIFByaWNlJztcbiAgICogICAgfVxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheUNoZWNrOiAocm93OiBhbnksIGNvbHVtbj86IGFueSwgdmFsdWU/OiBhbnkpID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgYm9vbGVhbiB5b3UgY2FuIHVzZSB0byBzZXQgdGhlIGRldGF1bHQgYmVoYXZpb3VyIG9mIHJvd3MgYW5kIGdyb3Vwc1xuICAgKiB3aGV0aGVyIHRoZXkgd2lsbCBzdGFydCBleHBhbmRlZCBvciBub3QuIElmIG9tbWl0ZWQgdGhlIGRlZmF1bHQgaXMgTk9UIGV4cGFuZGVkLlxuICAgKlxuICAgKi9cbiAgQElucHV0KCkgZ3JvdXBFeHBhbnNpb25EZWZhdWx0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByb3BlcnR5IHRvIHdoaWNoIHlvdSBjYW4gdXNlIGZvciBjdXN0b20gdHJhY2tpbmcgb2Ygcm93cy5cbiAgICogRXhhbXBsZTogJ25hbWUnXG4gICAqL1xuICBASW5wdXQoKSB0cmFja0J5UHJvcDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcm9wZXJ0eSB0byB3aGljaCB5b3UgY2FuIHVzZSBmb3IgZGV0ZXJtaW5pbmcgc2VsZWN0IGFsbFxuICAgKiByb3dzIG9uIGN1cnJlbnQgcGFnZSBvciBub3QuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBEYXRhdGFibGVDb21wb25lbnRcbiAgICovXG4gIEBJbnB1dCgpIHNlbGVjdEFsbFJvd3NPblBhZ2UgPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciByb3cgdmlydHVhbGl6YXRpb24gb24gLyBvZmZcbiAgICovXG4gIEBJbnB1dCgpIHZpcnR1YWxpemF0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogVHJlZSBmcm9tIHJlbGF0aW9uXG4gICAqL1xuICBASW5wdXQoKSB0cmVlRnJvbVJlbGF0aW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRyZWUgdG8gcmVsYXRpb25cbiAgICovXG4gIEBJbnB1dCgpIHRyZWVUb1JlbGF0aW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBmb3Igc3dpdGNoaW5nIHN1bW1hcnkgcm93IG9uIC8gb2ZmXG4gICAqL1xuICBASW5wdXQoKSBzdW1tYXJ5Um93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEEgaGVpZ2h0IG9mIHN1bW1hcnkgcm93XG4gICAqL1xuICBASW5wdXQoKSBzdW1tYXJ5SGVpZ2h0OiBudW1iZXIgPSAzMDtcblxuICAvKipcbiAgICogQSBwcm9wZXJ0eSBob2xkcyBhIHN1bW1hcnkgcm93IHBvc2l0aW9uOiB0b3AvYm90dG9tXG4gICAqL1xuICBASW5wdXQoKSBzdW1tYXJ5UG9zaXRpb246IHN0cmluZyA9ICd0b3AnO1xuXG4gIC8qKlxuICAgKiBCb2R5IHdhcyBzY3JvbGxlZCB0eXBpY2FsbHkgaW4gYSBgc2Nyb2xsYmFyVjp0cnVlYCBzY2VuYXJpby5cbiAgICovXG4gIEBPdXRwdXQoKSBzY3JvbGw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBBIHJvdyB3YXMgYWRkZWRcbiAgICovXG4gIEBPdXRwdXQoKSByb3dJbml0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBBIGNlbGwgb3Igcm93IHdhcyBmb2N1c2VkIHZpYSBrZXlib2FyZCBvciBtb3VzZSBjbGljay5cbiAgICovXG4gIEBPdXRwdXQoKSBhY3RpdmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEEgY2VsbCBvciByb3cgd2FzIHNlbGVjdGVkLlxuICAgKi9cbiAgQE91dHB1dCgpIHNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENvbHVtbiBzb3J0IHdhcyBpbnZva2VkLlxuICAgKi9cbiAgQE91dHB1dCgpIHNvcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFibGUgd2FzIHBhZ2VkIGVpdGhlciB0cmlnZ2VyZWQgYnkgdGhlIHBhZ2VyIG9yIHRoZSBib2R5IHNjcm9sbC5cbiAgICovXG4gIEBPdXRwdXQoKSBwYWdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ29sdW1ucyB3ZXJlIHJlLW9yZGVyZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVvcmRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIENvbHVtbiB3YXMgcmVzaXplZC5cbiAgICovXG4gIEBPdXRwdXQoKSByZXNpemU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCBtZW51IHdhcyBpbnZva2VkIG9uIHRoZSB0YWJsZS5cbiAgICogdHlwZSBpbmRpY2F0ZXMgd2hldGhlciB0aGUgaGVhZGVyIG9yIHRoZSBib2R5IHdhcyBjbGlja2VkLlxuICAgKiBjb250ZW50IGNvbnRhaW5zIGVpdGhlciB0aGUgY29sdW1uIG9yIHRoZSByb3cgdGhhdCB3YXMgY2xpY2tlZC5cbiAgICovXG4gIEBPdXRwdXQoKSB0YWJsZUNvbnRleHRtZW51ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50OyB0eXBlOiBDb250ZXh0bWVudVR5cGU7IGNvbnRlbnQ6IGFueSB9PihmYWxzZSk7XG4gIFxuICBAT3V0cHV0KCkgdGFibGVSb3dBZGRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEEgcm93IHdhcyBleHBhbmRlZCBvdCBjb2xsYXBzZWQgZm9yIHRyZWVcbiAgICovXG4gIEBPdXRwdXQoKSB0cmVlQWN0aW9uOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgaWYgdGhlIGhlYWRlciBoZWlnaHQgaWYgZml4ZWQgaGVpZ2h0LlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5maXhlZC1oZWFkZXInKVxuICBnZXQgaXNGaXhlZEhlYWRlcigpOiBib29sZWFuIHtcbiAgICBjb25zdCBoZWFkZXJIZWlnaHQ6IG51bWJlciB8IHN0cmluZyA9IHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgIHJldHVybiB0eXBlb2YgaGVhZGVySGVpZ2h0ID09PSAnc3RyaW5nJyA/IDxzdHJpbmc+aGVhZGVySGVpZ2h0ICE9PSAnYXV0bycgOiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHRoZSByb290IGVsZW1lbnQgaWZcbiAgICogdGhlIHJvdyBoZWlnaHRzIGFyZSBmaXhlZCBoZWlnaHRzLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5maXhlZC1yb3cnKVxuICBnZXQgaXNGaXhlZFJvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yb3dIZWlnaHQgIT09ICdhdXRvJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGVsZW1lbnQgaWZcbiAgICogdmVydGljYWwgc2Nyb2xsaW5nIGlzIGVuYWJsZWQuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNjcm9sbC12ZXJ0aWNhbCcpXG4gIGdldCBpc1ZlcnRTY3JvbGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsYmFyVjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGVsZW1lbnQgaWZcbiAgICogdmlydHVhbGl6YXRpb24gaXMgZW5hYmxlZC5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MudmlydHVhbGl6ZWQnKVxuICBnZXQgaXNWaXJ0dWFsaXplZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy52aXJ0dWFsaXphdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byB0aGUgcm9vdCBlbGVtZW50XG4gICAqIGlmIHRoZSBob3J6aW9udGFsIHNjcm9sbGluZyBpcyBlbmFibGVkLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zY3JvbGwtaG9yeicpXG4gIGdldCBpc0hvclNjcm9sbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zY3JvbGxiYXJIO1xuICB9XG5cbiAgLyoqXG4gICAqIENTUyBjbGFzcyBhcHBsaWVkIHRvIHJvb3QgZWxlbWVudCBpcyBzZWxlY3RhYmxlLlxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zZWxlY3RhYmxlJylcbiAgZ2V0IGlzU2VsZWN0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25UeXBlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBpcyBjaGVja2JveCBzZWxlY3Rpb24uXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmNoZWNrYm94LXNlbGVjdGlvbicpXG4gIGdldCBpc0NoZWNrYm94U2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuY2hlY2tib3g7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFwcGxpZWQgdG8gcm9vdCBpZiBjZWxsIHNlbGVjdGlvbi5cbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MuY2VsbC1zZWxlY3Rpb24nKVxuICBnZXQgaXNDZWxsU2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuY2VsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYXBwbGllZCB0byByb290IGlmIHNpbmdsZSBzZWxlY3QuXG4gICAqL1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNpbmdsZS1zZWxlY3Rpb24nKVxuICBnZXQgaXNTaW5nbGVTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5zaW5nbGU7XG4gIH1cblxuICAvKipcbiAgICogQ1NTIGNsYXNzIGFkZGVkIHRvIHJvb3QgZWxlbWVudCBpZiBtdWxpdCBzZWxlY3RcbiAgICovXG4gIEBIb3N0QmluZGluZygnY2xhc3MubXVsdGktc2VsZWN0aW9uJylcbiAgZ2V0IGlzTXVsdGlTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5tdWx0aTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDU1MgY2xhc3MgYWRkZWQgdG8gcm9vdCBlbGVtZW50IGlmIG11bGl0IGNsaWNrIHNlbGVjdFxuICAgKi9cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tdWx0aS1jbGljay1zZWxlY3Rpb24nKVxuICBnZXQgaXNNdWx0aUNsaWNrU2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUubXVsdGlDbGljaztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb2x1bW4gdGVtcGxhdGVzIGdhdGhlcmVkIGZyb20gYENvbnRlbnRDaGlsZHJlbmBcbiAgICogaWYgZGVzY3JpYmVkIGluIHlvdXIgbWFya3VwLlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUpXG4gIHNldCBjb2x1bW5UZW1wbGF0ZXModmFsOiBRdWVyeUxpc3Q8RGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlPikge1xuICAgIHRoaXMuX2NvbHVtblRlbXBsYXRlcyA9IHZhbDtcbiAgICB0aGlzLnRyYW5zbGF0ZUNvbHVtbnModmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb2x1bW4gdGVtcGxhdGVzLlxuICAgKi9cbiAgZ2V0IGNvbHVtblRlbXBsYXRlcygpOiBRdWVyeUxpc3Q8RGF0YVRhYmxlQ29sdW1uRGlyZWN0aXZlPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtblRlbXBsYXRlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSb3cgRGV0YWlsIHRlbXBsYXRlcyBnYXRoZXJlZCBmcm9tIHRoZSBDb250ZW50Q2hpbGRcbiAgICovXG4gIEBDb250ZW50Q2hpbGQoRGF0YXRhYmxlUm93RGV0YWlsRGlyZWN0aXZlLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcm93RGV0YWlsOiBEYXRhdGFibGVSb3dEZXRhaWxEaXJlY3RpdmU7XG5cbiAgLyoqXG4gICAqIEdyb3VwIEhlYWRlciB0ZW1wbGF0ZXMgZ2F0aGVyZWQgZnJvbSB0aGUgQ29udGVudENoaWxkXG4gICAqL1xuICBAQ29udGVudENoaWxkKERhdGF0YWJsZUdyb3VwSGVhZGVyRGlyZWN0aXZlLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgZ3JvdXBIZWFkZXI6IERhdGF0YWJsZUdyb3VwSGVhZGVyRGlyZWN0aXZlO1xuXG4gIC8qKlxuICAgKiBGb290ZXIgdGVtcGxhdGUgZ2F0aGVyZWQgZnJvbSB0aGUgQ29udGVudENoaWxkXG4gICAqL1xuICBAQ29udGVudENoaWxkKERhdGF0YWJsZUZvb3RlckRpcmVjdGl2ZSwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGZvb3RlcjogRGF0YXRhYmxlRm9vdGVyRGlyZWN0aXZlO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGJvZHkgY29tcG9uZW50IGZvciBtYW51YWxseVxuICAgKiBpbnZva2luZyBmdW5jdGlvbnMgb24gdGhlIGJvZHkuXG4gICAqL1xuICBAVmlld0NoaWxkKERhdGFUYWJsZUJvZHlDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBib2R5Q29tcG9uZW50OiBEYXRhVGFibGVCb2R5Q29tcG9uZW50O1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGhlYWRlciBjb21wb25lbnQgZm9yIG1hbnVhbGx5XG4gICAqIGludm9raW5nIGZ1bmN0aW9ucyBvbiB0aGUgaGVhZGVyLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YXRhYmxlQ29tcG9uZW50XG4gICAqL1xuICBAVmlld0NoaWxkKERhdGFUYWJsZUhlYWRlckNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGhlYWRlckNvbXBvbmVudDogRGF0YVRhYmxlSGVhZGVyQ29tcG9uZW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGlmIGFsbCByb3dzIGFyZSBzZWxlY3RlZC5cbiAgICovXG4gIGdldCBhbGxSb3dzU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgbGV0IGFsbFJvd3NTZWxlY3RlZCA9IHRoaXMucm93cyAmJiB0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09PSB0aGlzLnJvd3MubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMuc2VsZWN0QWxsUm93c09uUGFnZSkge1xuICAgICAgY29uc3QgaW5kZXhlcyA9IHRoaXMuYm9keUNvbXBvbmVudC5pbmRleGVzO1xuICAgICAgY29uc3Qgcm93c09uUGFnZSA9IGluZGV4ZXMubGFzdCAtIGluZGV4ZXMuZmlyc3Q7XG4gICAgICBhbGxSb3dzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gcm93c09uUGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZCAmJiB0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCAhPT0gMCAmJiBhbGxSb3dzU2VsZWN0ZWQ7XG4gIH1cblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgX2lubmVyV2lkdGg6IG51bWJlcjtcbiAgcGFnZVNpemU6IG51bWJlcjtcbiAgYm9keUhlaWdodDogbnVtYmVyO1xuICByb3dDb3VudDogbnVtYmVyID0gMDtcbiAgcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xuXG4gIF9vZmZzZXRYID0gbmV3IEJlaGF2aW9yU3ViamVjdCgwKTtcbiAgX2xpbWl0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIF9jb3VudDogbnVtYmVyID0gMDtcbiAgX29mZnNldDogbnVtYmVyID0gMDtcbiAgX3Jvd3M6IGFueVtdO1xuICBfZ3JvdXBSb3dzQnk6IHN0cmluZztcbiAgX2ludGVybmFsUm93czogYW55W107XG4gIF9pbnRlcm5hbFJvd3NIYXNoOiB7fTtcbiAgX2ludGVybmFsQ29sdW1uczogVGFibGVDb2x1bW5bXTtcbiAgX2NvbHVtbnM6IFRhYmxlQ29sdW1uW107XG4gIF9jb2x1bW5UZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmU+O1xuICBfc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAU2tpcFNlbGYoKSBwcml2YXRlIHNjcm9sbGJhckhlbHBlcjogU2Nyb2xsYmFySGVscGVyLFxuICAgIEBTa2lwU2VsZigpIHByaXZhdGUgZGltZW5zaW9uc0hlbHBlcjogRGltZW5zaW9uc0hlbHBlcixcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICBwcml2YXRlIGNvbHVtbkNoYW5nZXNTZXJ2aWNlOiBDb2x1bW5DaGFuZ2VzU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KCdjb25maWd1cmF0aW9uJykgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBJTmd4RGF0YXRhYmxlQ29uZmlnXG4gICkge1xuICAgIC8vIGdldCByZWYgdG8gZWxtIGZvciBtZWFzdXJpbmdcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5yb3dEaWZmZXIgPSBkaWZmZXJzLmZpbmQoe30pLmNyZWF0ZSgpO1xuXG4gICAgLy8gYXBwbHkgZ2xvYmFsIHNldHRpbmdzIGZyb20gTW9kdWxlLmZvclJvb3RcbiAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uICYmIHRoaXMuY29uZmlndXJhdGlvbi5tZXNzYWdlcykge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IHsgLi4udGhpcy5jb25maWd1cmF0aW9uLm1lc3NhZ2VzIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCBiZSB1c2VkIHdoZW4gZGlzcGxheWluZyBvciBzZWxlY3Rpbmcgcm93cy5cbiAgICogd2hlbiB0cmFja2luZy9jb21wYXJpbmcgdGhlbSwgd2UnbGwgdXNlIHRoZSB2YWx1ZSBvZiB0aGlzIGZuLFxuICAgKlxuICAgKiAoYGZuKHgpID09PSBmbih5KWAgaW5zdGVhZCBvZiBgeCA9PT0geWApXG4gICAqL1xuICBASW5wdXQoKSByb3dJZGVudGl0eTogKHg6IGFueSkgPT4gYW55ID0gKHg6IGFueSkgPT4geDtcblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgZGF0YS1ib3VuZFxuICAgKiBwcm9wZXJ0aWVzIG9mIGEgZGlyZWN0aXZlIGFyZSBpbml0aWFsaXplZC5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIG5lZWQgdG8gY2FsbCB0aGlzIGltbWVkaWF0bHkgdG8gc2l6ZVxuICAgIC8vIGlmIHRoZSB0YWJsZSBpcyBoaWRkZW4gdGhlIHZpc2liaWxpdHlcbiAgICAvLyBsaXN0ZW5lciB3aWxsIGludm9rZSB0aGlzIGl0c2VsZiB1cG9uIHNob3dcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgYSBjb21wb25lbnQnc1xuICAgKiB2aWV3IGhhcyBiZWVuIGZ1bGx5IGluaXRpYWxpemVkLlxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5leHRlcm5hbFNvcnRpbmcpIHtcbiAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgIH1cblxuICAgIC8vIHRoaXMgaGFzIHRvIGJlIGRvbmUgdG8gcHJldmVudCB0aGUgY2hhbmdlIGRldGVjdGlvblxuICAgIC8vIHRyZWUgZnJvbSBmcmVha2luZyBvdXQgYmVjYXVzZSB3ZSBhcmUgcmVhZGp1c3RpbmdcbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuXG4gICAgICAvLyBlbWl0IHBhZ2UgZm9yIHZpcnR1YWwgc2VydmVyLXNpZGUga2lja29mZlxuICAgICAgaWYgKHRoaXMuZXh0ZXJuYWxQYWdpbmcgJiYgdGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgICAgICBsaW1pdDogdGhpcy5saW1pdCxcbiAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGhvb2sgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgYSBjb21wb25lbnQnc1xuICAgKiBjb250ZW50IGhhcyBiZWVuIGZ1bGx5IGluaXRpYWxpemVkLlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuY29sdW1uVGVtcGxhdGVzLmNoYW5nZXMuc3Vic2NyaWJlKHYgPT4gdGhpcy50cmFuc2xhdGVDb2x1bW5zKHYpKTtcblxuICAgIHRoaXMubGlzdGVuRm9yQ29sdW1uSW5wdXRDaGFuZ2VzKCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlcyB0aGUgdGVtcGxhdGVzIHRvIHRoZSBjb2x1bW4gb2JqZWN0c1xuICAgKi9cbiAgdHJhbnNsYXRlQ29sdW1ucyh2YWw6IGFueSkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIGNvbnN0IGFyciA9IHZhbC50b0FycmF5KCk7XG4gICAgICBpZiAoYXJyLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSB0cmFuc2xhdGVUZW1wbGF0ZXMoYXJyKTtcbiAgICAgICAgc2V0Q29sdW1uRGVmYXVsdHModGhpcy5faW50ZXJuYWxDb2x1bW5zKTtcbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoKTtcbiAgICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBtYXAgd2l0aCB0aGUgZGF0YSBncm91cGVkIGJ5IHRoZSB1c2VyIGNob2ljZSBvZiBncm91cGluZyBpbmRleFxuICAgKlxuICAgKiBAcGFyYW0gb3JpZ2luYWxBcnJheSB0aGUgb3JpZ2luYWwgYXJyYXkgcGFzc2VkIHZpYSBwYXJhbWV0ZXJcbiAgICogQHBhcmFtIGdyb3VwQnlJbmRleCAgdGhlIGluZGV4IG9mIHRoZSBjb2x1bW4gdG8gZ3JvdXAgdGhlIGRhdGEgYnlcbiAgICovXG4gIGdyb3VwQXJyYXlCeShvcmlnaW5hbEFycmF5OiBhbnksIGdyb3VwQnk6IGFueSkge1xuICAgIC8vIGNyZWF0ZSBhIG1hcCB0byBob2xkIGdyb3VwcyB3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgcmVzdWx0c1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBsZXQgaTogbnVtYmVyID0gMDtcblxuICAgIG9yaWdpbmFsQXJyYXkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBpdGVtW2dyb3VwQnldO1xuICAgICAgaWYgKCFtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIFtpdGVtXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXAuZ2V0KGtleSkucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9KTtcblxuICAgIGNvbnN0IGFkZEdyb3VwID0gKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiB7XG4gICAgICByZXR1cm4geyBrZXksIHZhbHVlIH07XG4gICAgfTtcblxuICAgIC8vIGNvbnZlcnQgbWFwIGJhY2sgdG8gYSBzaW1wbGUgYXJyYXkgb2Ygb2JqZWN0c1xuICAgIHJldHVybiBBcnJheS5mcm9tKG1hcCwgeCA9PiBhZGRHcm91cCh4WzBdLCB4WzFdKSk7XG4gIH1cblxuICAvKlxuICAgKiBMaWZlY3ljbGUgaG9vayB0aGF0IGlzIGNhbGxlZCB3aGVuIEFuZ3VsYXIgZGlydHkgY2hlY2tzIGEgZGlyZWN0aXZlLlxuICAgKi9cbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJvd0RpZmZlci5kaWZmKHRoaXMucm93cykpIHtcbiAgICAgIGlmICghdGhpcy5leHRlcm5hbFNvcnRpbmcpIHtcbiAgICAgICAgdGhpcy5zb3J0SW50ZXJuYWxSb3dzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBbLi4udGhpcy5yb3dzXTtcbiAgICAgIH1cblxuICAgICAgLy8gYXV0byBncm91cCBieSBwYXJlbnQgb24gbmV3IHVwZGF0ZVxuICAgICAgdGhpcy5faW50ZXJuYWxSb3dzID0gZ3JvdXBSb3dzQnlQYXJlbnRzKFxuICAgICAgICB0aGlzLl9pbnRlcm5hbFJvd3MsXG4gICAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVGcm9tUmVsYXRpb24pLFxuICAgICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlVG9SZWxhdGlvbilcbiAgICAgICk7XG5cbiAgICAgIHRoaXMucmVjYWxjdWxhdGVQYWdlcygpO1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjJ3MgdGhlIHNpemVzIG9mIHRoZSBncmlkLlxuICAgKlxuICAgKiBVcGRhdGVkIGF1dG9tYXRpY2FsbHkgb24gY2hhbmdlcyB0bzpcbiAgICpcbiAgICogIC0gQ29sdW1uc1xuICAgKiAgLSBSb3dzXG4gICAqICAtIFBhZ2luZyByZWxhdGVkXG4gICAqXG4gICAqIEFsc28gY2FuIGJlIG1hbnVhbGx5IGludm9rZWQgb3IgdXBvbiB3aW5kb3cgcmVzaXplLlxuICAgKi9cbiAgcmVjYWxjdWxhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5yZWNhbGN1bGF0ZURpbXMoKTtcbiAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpbmRvdyByZXNpemUgaGFuZGxlciB0byB1cGRhdGUgc2l6ZXMuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgQHRocm90dGxlYWJsZSg1KVxuICBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWx1bGNhdGVzIHRoZSBjb2x1bW4gd2lkdGhzIGJhc2VkIG9uIGNvbHVtbiB3aWR0aFxuICAgKiBkaXN0cmlidXRpb24gbW9kZSBhbmQgc2Nyb2xsYmFyIG9mZnNldHMuXG4gICAqL1xuICByZWNhbGN1bGF0ZUNvbHVtbnMoXG4gICAgY29sdW1uczogYW55W10gPSB0aGlzLl9pbnRlcm5hbENvbHVtbnMsXG4gICAgZm9yY2VJZHg6IG51bWJlciA9IC0xLFxuICAgIGFsbG93QmxlZWQ6IGJvb2xlYW4gPSB0aGlzLnNjcm9sbGJhckhcbiAgKTogYW55W10gfCB1bmRlZmluZWQge1xuICAgIGlmICghY29sdW1ucykgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgIGxldCB3aWR0aCA9IHRoaXMuX2lubmVyV2lkdGg7XG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xuICAgICAgd2lkdGggPSB3aWR0aCAtIHRoaXMuc2Nyb2xsYmFySGVscGVyLndpZHRoO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbHVtbk1vZGUgPT09IENvbHVtbk1vZGUuZm9yY2UpIHtcbiAgICAgIGZvcmNlRmlsbENvbHVtbldpZHRocyhjb2x1bW5zLCB3aWR0aCwgZm9yY2VJZHgsIGFsbG93QmxlZWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb2x1bW5Nb2RlID09PSBDb2x1bW5Nb2RlLmZsZXgpIHtcbiAgICAgIGFkanVzdENvbHVtbldpZHRocyhjb2x1bW5zLCB3aWR0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbHVtbnM7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSB0YWJsZSBzaXplLlxuICAgKiBJbnRlcm5hbGx5IGNhbGxzIHRoZSBwYWdlIHNpemUgYW5kIHJvdyBjb3VudCBjYWxjcyB0b28uXG4gICAqXG4gICAqL1xuICByZWNhbGN1bGF0ZURpbXMoKTogdm9pZCB7XG4gICAgY29uc3QgZGltcyA9IHRoaXMuZGltZW5zaW9uc0hlbHBlci5nZXREaW1lbnNpb25zKHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5faW5uZXJXaWR0aCA9IE1hdGguZmxvb3IoZGltcy53aWR0aCk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICBsZXQgaGVpZ2h0ID0gZGltcy5oZWlnaHQ7XG4gICAgICBpZiAodGhpcy5oZWFkZXJIZWlnaHQpIGhlaWdodCA9IGhlaWdodCAtIHRoaXMuaGVhZGVySGVpZ2h0O1xuICAgICAgaWYgKHRoaXMuZm9vdGVySGVpZ2h0KSBoZWlnaHQgPSBoZWlnaHQgLSB0aGlzLmZvb3RlckhlaWdodDtcbiAgICAgIHRoaXMuYm9keUhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLnJlY2FsY3VsYXRlUGFnZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHBhZ2VzIGFmdGVyIGEgdXBkYXRlLlxuICAgKi9cbiAgcmVjYWxjdWxhdGVQYWdlcygpOiB2b2lkIHtcbiAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jYWxjUGFnZVNpemUoKTtcbiAgICB0aGlzLnJvd0NvdW50ID0gdGhpcy5jYWxjUm93Q291bnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCb2R5IHRyaWdnZXJlZCBhIHBhZ2UgZXZlbnQuXG4gICAqL1xuICBvbkJvZHlQYWdlKHsgb2Zmc2V0IH06IGFueSk6IHZvaWQge1xuICAgIC8vIEF2b2lkIHBhZ2luYXRpb24gY2FtaW5nIGZyb20gYm9keSBldmVudHMgbGlrZSBzY3JvbGwgd2hlbiB0aGUgdGFibGVcbiAgICAvLyBoYXMgbm8gdmlydHVhbGl6YXRpb24gYW5kIHRoZSBleHRlcm5hbCBwYWdpbmcgaXMgZW5hYmxlLlxuICAgIC8vIFRoaXMgbWVhbnMsIGxldCdzIHRoZSBkZXZlbG9wZXIgaGFuZGxlIHBhZ2luYXRpb24gYnkgbXkgaGltKGhlcikgc2VsZlxuICAgIGlmICh0aGlzLmV4dGVybmFsUGFnaW5nICYmICF0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGltaXQ6IHRoaXMubGltaXQsXG4gICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJvZHkgdHJpZ2dlcmVkIGEgc2Nyb2xsIGV2ZW50LlxuICAgKi9cbiAgb25Cb2R5U2Nyb2xsKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5fb2Zmc2V0WC5uZXh0KGV2ZW50Lm9mZnNldFgpO1xuICAgIHRoaXMuc2Nyb2xsLmVtaXQoZXZlbnQpO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBmb290ZXIgdHJpZ2dlcmVkIGEgcGFnZSBldmVudC5cbiAgICovXG4gIG9uRm9vdGVyUGFnZShldmVudDogYW55KSB7XG4gICAgdGhpcy5vZmZzZXQgPSBldmVudC5wYWdlIC0gMTtcbiAgICB0aGlzLmJvZHlDb21wb25lbnQudXBkYXRlT2Zmc2V0WSh0aGlzLm9mZnNldCk7XG5cbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBjb3VudDogdGhpcy5jb3VudCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGltaXQ6IHRoaXMubGltaXQsXG4gICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5zZWxlY3RBbGxSb3dzT25QYWdlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHtcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzIG9uIHJvd0luaXRlZCBldmVudFxuICAgKi9cbiAgb25Sb3dJbml0ZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMucm93SW5pdGVkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgc2l6ZXMgb2YgdGhlIHBhZ2VcbiAgICovXG4gIGNhbGNQYWdlU2l6ZSh2YWw6IGFueVtdID0gdGhpcy5yb3dzKTogbnVtYmVyIHtcbiAgICAvLyBLZWVwIHRoZSBwYWdlIHNpemUgY29uc3RhbnQgZXZlbiBpZiB0aGUgcm93IGhhcyBiZWVuIGV4cGFuZGVkLlxuICAgIC8vIFRoaXMgaXMgYmVjYXVzZSBhbiBleHBhbmRlZCByb3cgaXMgc3RpbGwgY29uc2lkZXJlZCB0byBiZSBhIGNoaWxkIG9mXG4gICAgLy8gdGhlIG9yaWdpbmFsIHJvdy4gIEhlbmNlIGNhbGN1bGF0aW9uIHdvdWxkIHVzZSByb3dIZWlnaHQgb25seS5cbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgIGNvbnN0IHNpemUgPSBNYXRoLmNlaWwodGhpcy5ib2R5SGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0IGFzIG51bWJlcikpO1xuICAgICAgcmV0dXJuIE1hdGgubWF4KHNpemUsIDApO1xuICAgIH1cblxuICAgIC8vIGlmIGxpbWl0IGlzIHBhc3NlZCwgd2UgYXJlIHBhZ2luZ1xuICAgIGlmICh0aGlzLmxpbWl0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmxpbWl0O1xuICAgIH1cblxuICAgIC8vIG90aGVyd2lzZSB1c2Ugcm93IGxlbmd0aFxuICAgIGlmICh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIG90aGVyIGVtcHR5IDooXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgcm93IGNvdW50LlxuICAgKi9cbiAgY2FsY1Jvd0NvdW50KHZhbDogYW55W10gPSB0aGlzLnJvd3MpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy5leHRlcm5hbFBhZ2luZykge1xuICAgICAgaWYgKCF2YWwpIHJldHVybiAwO1xuXG4gICAgICBpZiAodGhpcy5ncm91cGVkUm93cykge1xuICAgICAgICByZXR1cm4gdGhpcy5ncm91cGVkUm93cy5sZW5ndGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudHJlZUZyb21SZWxhdGlvbiAhPSBudWxsICYmIHRoaXMudHJlZVRvUmVsYXRpb24gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJuYWxSb3dzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWwubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29udGV4dG1lbnUgZXZlbnQuXG4gICAqL1xuICBvbkNvbHVtbkNvbnRleHRtZW51KHsgZXZlbnQsIGNvbHVtbiB9OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlQ29udGV4dG1lbnUuZW1pdCh7IGV2ZW50LCB0eXBlOiBDb250ZXh0bWVudVR5cGUuaGVhZGVyLCBjb250ZW50OiBjb2x1bW4gfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJvZHkgdHJpZ2dlcmVkIGEgY29udGV4dG1lbnUgZXZlbnQuXG4gICAqL1xuICBvblJvd0NvbnRleHRtZW51KHsgZXZlbnQsIHJvdyB9OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlQ29udGV4dG1lbnUuZW1pdCh7IGV2ZW50LCB0eXBlOiBDb250ZXh0bWVudVR5cGUuYm9keSwgY29udGVudDogcm93IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29sdW1uIHJlc2l6ZSBldmVudC5cbiAgICovXG4gIG9uQ29sdW1uUmVzaXplKHsgY29sdW1uLCBuZXdWYWx1ZSB9OiBhbnkpOiB2b2lkIHtcbiAgICAvKiBTYWZhcmkvaU9TIDEwLjIgd29ya2Fyb3VuZCAqL1xuICAgIGlmIChjb2x1bW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHg6IG51bWJlcjtcbiAgICBjb25zdCBjb2xzID0gdGhpcy5faW50ZXJuYWxDb2x1bW5zLm1hcCgoYywgaSkgPT4ge1xuICAgICAgYyA9IHsgLi4uYyB9O1xuXG4gICAgICBpZiAoYy4kJGlkID09PSBjb2x1bW4uJCRpZCkge1xuICAgICAgICBpZHggPSBpO1xuICAgICAgICBjLndpZHRoID0gbmV3VmFsdWU7XG5cbiAgICAgICAgLy8gc2V0IHRoaXMgc28gd2UgY2FuIGZvcmNlIHRoZSBjb2x1bW5cbiAgICAgICAgLy8gd2lkdGggZGlzdHJpYnV0aW9uIHRvIGJlIHRvIHRoaXMgdmFsdWVcbiAgICAgICAgYy4kJG9sZFdpZHRoID0gbmV3VmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNhbGN1bGF0ZUNvbHVtbnMoY29scywgaWR4KTtcbiAgICB0aGlzLl9pbnRlcm5hbENvbHVtbnMgPSBjb2xzO1xuXG4gICAgdGhpcy5yZXNpemUuZW1pdCh7XG4gICAgICBjb2x1bW4sXG4gICAgICBuZXdWYWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBoZWFkZXIgdHJpZ2dlcmVkIGEgY29sdW1uIHJlLW9yZGVyIGV2ZW50LlxuICAgKi9cbiAgb25Db2x1bW5SZW9yZGVyKHsgY29sdW1uLCBuZXdWYWx1ZSwgcHJldlZhbHVlIH06IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbHMgPSB0aGlzLl9pbnRlcm5hbENvbHVtbnMubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIHsgLi4uYyB9O1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc3dhcENvbHVtbnMpIHtcbiAgICAgIGNvbnN0IHByZXZDb2wgPSBjb2xzW25ld1ZhbHVlXTtcbiAgICAgIGNvbHNbbmV3VmFsdWVdID0gY29sdW1uO1xuICAgICAgY29sc1twcmV2VmFsdWVdID0gcHJldkNvbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld1ZhbHVlID4gcHJldlZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG1vdmVkQ29sID0gY29sc1twcmV2VmFsdWVdO1xuICAgICAgICBmb3IgKGxldCBpID0gcHJldlZhbHVlOyBpIDwgbmV3VmFsdWU7IGkrKykge1xuICAgICAgICAgIGNvbHNbaV0gPSBjb2xzW2kgKyAxXTtcbiAgICAgICAgfVxuICAgICAgICBjb2xzW25ld1ZhbHVlXSA9IG1vdmVkQ29sO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbW92ZWRDb2wgPSBjb2xzW3ByZXZWYWx1ZV07XG4gICAgICAgIGZvciAobGV0IGkgPSBwcmV2VmFsdWU7IGkgPiBuZXdWYWx1ZTsgaS0tKSB7XG4gICAgICAgICAgY29sc1tpXSA9IGNvbHNbaSAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGNvbHNbbmV3VmFsdWVdID0gbW92ZWRDb2w7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5faW50ZXJuYWxDb2x1bW5zID0gY29scztcblxuICAgIHRoaXMucmVvcmRlci5lbWl0KHtcbiAgICAgIGNvbHVtbixcbiAgICAgIG5ld1ZhbHVlLFxuICAgICAgcHJldlZhbHVlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGhlYWRlciB0cmlnZ2VyZWQgYSBjb2x1bW4gc29ydCBldmVudC5cbiAgICovXG4gIG9uQ29sdW1uU29ydChldmVudDogYW55KTogdm9pZCB7XG4gICAgLy8gY2xlYW4gc2VsZWN0ZWQgcm93c1xuICAgIGlmICh0aGlzLnNlbGVjdEFsbFJvd3NPblBhZ2UpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbXTtcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoe1xuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zb3J0cyA9IGV2ZW50LnNvcnRzO1xuXG4gICAgLy8gdGhpcyBjb3VsZCBiZSBvcHRpbWl6ZWQgYmV0dGVyIHNpbmNlIGl0IHdpbGwgcmVzb3J0XG4gICAgLy8gdGhlIHJvd3MgYWdhaW4gb24gdGhlICdwdXNoJyBkZXRlY3Rpb24uLi5cbiAgICBpZiAodGhpcy5leHRlcm5hbFNvcnRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAvLyBkb24ndCB1c2Ugbm9ybWFsIHNldHRlciBzbyB3ZSBkb24ndCByZXNvcnRcbiAgICAgIHRoaXMuc29ydEludGVybmFsUm93cygpO1xuICAgIH1cblxuICAgIC8vIGF1dG8gZ3JvdXAgYnkgcGFyZW50IG9uIG5ldyB1cGRhdGVcbiAgICB0aGlzLl9pbnRlcm5hbFJvd3MgPSBncm91cFJvd3NCeVBhcmVudHMoXG4gICAgICB0aGlzLl9pbnRlcm5hbFJvd3MsXG4gICAgICBvcHRpb25hbEdldHRlckZvclByb3AodGhpcy50cmVlRnJvbVJlbGF0aW9uKSxcbiAgICAgIG9wdGlvbmFsR2V0dGVyRm9yUHJvcCh0aGlzLnRyZWVUb1JlbGF0aW9uKVxuICAgICk7XG5cbiAgICAvLyBBbHdheXMgZ28gdG8gZmlyc3QgcGFnZSB3aGVuIHNvcnRpbmcgdG8gc2VlIHRoZSBuZXdseSBzb3J0ZWQgZGF0YVxuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICB0aGlzLmJvZHlDb21wb25lbnQudXBkYXRlT2Zmc2V0WSh0aGlzLm9mZnNldCk7XG4gICAgdGhpcy5zb3J0LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBhbGwgcm93IHNlbGVjdGlvblxuICAgKi9cbiAgb25IZWFkZXJTZWxlY3QoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlbGVjdEFsbFJvd3NPblBhZ2UpIHtcbiAgICAgIC8vIGJlZm9yZSB3ZSBzcGxpY2UsIGNoayBpZiB3ZSBjdXJyZW50bHkgaGF2ZSBhbGwgc2VsZWN0ZWRcbiAgICAgIGNvbnN0IGZpcnN0ID0gdGhpcy5ib2R5Q29tcG9uZW50LmluZGV4ZXMuZmlyc3Q7XG4gICAgICBjb25zdCBsYXN0ID0gdGhpcy5ib2R5Q29tcG9uZW50LmluZGV4ZXMubGFzdDtcbiAgICAgIGNvbnN0IGFsbFNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZC5sZW5ndGggPT09IGxhc3QgLSBmaXJzdDtcblxuICAgICAgLy8gcmVtb3ZlIGFsbCBleGlzdGluZyBlaXRoZXIgd2F5XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW107XG5cbiAgICAgIC8vIGRvIHRoZSBvcHBvc2l0ZSBoZXJlXG4gICAgICBpZiAoIWFsbFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQucHVzaCguLi50aGlzLl9pbnRlcm5hbFJvd3Muc2xpY2UoZmlyc3QsIGxhc3QpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYmVmb3JlIHdlIHNwbGljZSwgY2hrIGlmIHdlIGN1cnJlbnRseSBoYXZlIGFsbCBzZWxlY3RlZFxuICAgICAgY29uc3QgYWxsU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PT0gdGhpcy5yb3dzLmxlbmd0aDtcbiAgICAgIC8vIHJlbW92ZSBhbGwgZXhpc3RpbmcgZWl0aGVyIHdheVxuICAgICAgdGhpcy5zZWxlY3RlZCA9IFtdO1xuICAgICAgLy8gZG8gdGhlIG9wcG9zaXRlIGhlcmVcbiAgICAgIGlmICghYWxsU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5wdXNoKC4uLnRoaXMucm93cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3QuZW1pdCh7XG4gICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcm93IHdhcyBzZWxlY3RlZCBmcm9tIGJvZHlcbiAgICovXG4gIG9uQm9keVNlbGVjdChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQSByb3cgd2FzIGV4cGFuZGVkIG9yIGNvbGxhcHNlZCBmb3IgdHJlZVxuICAgKi9cbiAgb25UcmVlQWN0aW9uKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCByb3cgPSBldmVudC5yb3c7XG4gICAgLy8gVE9ETzogRm9yIGR1cGxpY2F0ZWQgaXRlbXMgdGhpcyB3aWxsIG5vdCB3b3JrXG4gICAgY29uc3Qgcm93SW5kZXggPSB0aGlzLl9yb3dzLmZpbmRJbmRleChyID0+IHJbdGhpcy50cmVlVG9SZWxhdGlvbl0gPT09IGV2ZW50LnJvd1t0aGlzLnRyZWVUb1JlbGF0aW9uXSk7XG4gICAgdGhpcy50cmVlQWN0aW9uLmVtaXQoeyByb3csIHJvd0luZGV4IH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogbGlzdGVuIGZvciBjaGFuZ2VzIHRvIGlucHV0IGJpbmRpbmdzIG9mIGFsbCBEYXRhVGFibGVDb2x1bW5EaXJlY3RpdmUgYW5kXG4gICAqIHRyaWdnZXIgdGhlIGNvbHVtblRlbXBsYXRlcy5jaGFuZ2VzIG9ic2VydmFibGUgdG8gZW1pdFxuICAgKi9cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JDb2x1bW5JbnB1dENoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5jb2x1bW5DaGFuZ2VzU2VydmljZS5jb2x1bW5JbnB1dENoYW5nZXMkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbHVtblRlbXBsYXRlcykge1xuICAgICAgICAgIHRoaXMuY29sdW1uVGVtcGxhdGVzLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHNvcnRJbnRlcm5hbFJvd3MoKTogdm9pZCB7XG4gICAgdGhpcy5faW50ZXJuYWxSb3dzID0gc29ydFJvd3ModGhpcy5faW50ZXJuYWxSb3dzLCB0aGlzLl9pbnRlcm5hbENvbHVtbnMsIHRoaXMuc29ydHMpO1xuICB9XG59XG4iXX0=
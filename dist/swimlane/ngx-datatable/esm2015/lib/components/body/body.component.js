/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input, HostBinding, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ScrollerComponent } from './scroller.component';
import { SelectionType } from '../../types/selection.type';
import { columnsByPin, columnGroupWidths } from '../../utils/column';
import { RowHeightCache } from '../../utils/row-height-cache';
import { translateXY } from '../../utils/translate';
export class DataTableBodyComponent {
    /**
     * Creates an instance of DataTableBodyComponent.
     * @param {?} cd
     */
    constructor(cd) {
        this.cd = cd;
        this.selected = [];
        this.scroll = new EventEmitter();
        this.page = new EventEmitter();
        this.activate = new EventEmitter();
        this.select = new EventEmitter();
        this.detailToggle = new EventEmitter();
        this.rowContextmenu = new EventEmitter(false);
        this.treeAction = new EventEmitter();
        this.rowInited = new EventEmitter();
        this.rowHeightsCache = new RowHeightCache();
        this.temp = [];
        this.offsetY = 0;
        this.indexes = {};
        this.rowIndexes = new Map();
        this.rowExpansions = new Map();
        /**
         * Get the height of the detail row.
         */
        this.getDetailRowHeight = (/**
         * @param {?=} row
         * @param {?=} index
         * @return {?}
         */
        (row, index) => {
            if (!this.rowDetail) {
                return 0;
            }
            /** @type {?} */
            const rowHeight = this.rowDetail.rowHeight;
            return typeof rowHeight === 'function' ? rowHeight(row, index) : ((/** @type {?} */ (rowHeight)));
        });
        // declare fn here so we can get access to the `this` property
        this.rowTrackingFn = (/**
         * @param {?} index
         * @param {?} row
         * @return {?}
         */
        (index, row) => {
            /** @type {?} */
            const idx = this.getRowIndex(row);
            if (this.trackByProp) {
                return row[this.trackByProp];
            }
            else {
                return idx;
            }
        });
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set pageSize(val) {
        this._pageSize = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get pageSize() {
        return this._pageSize;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set rows(val) {
        this._rows = val;
        this.rowExpansions.clear();
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get rows() {
        return this._rows;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set columns(val) {
        this._columns = val;
        /** @type {?} */
        const colsByPin = columnsByPin(val);
        this.columnGroupWidths = columnGroupWidths(colsByPin, val);
    }
    /**
     * @return {?}
     */
    get columns() {
        return this._columns;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set offset(val) {
        this._offset = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get offset() {
        return this._offset;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set rowCount(val) {
        this._rowCount = val;
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get rowCount() {
        return this._rowCount;
    }
    /**
     * @return {?}
     */
    get bodyWidth() {
        if (this.scrollbarH) {
            return this.innerWidth + 'px';
        }
        else {
            return '100%';
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set bodyHeight(val) {
        if (this.scrollbarV) {
            this._bodyHeight = val + 'px';
        }
        else {
            this._bodyHeight = 'auto';
        }
        this.recalcLayout();
    }
    /**
     * @return {?}
     */
    get bodyHeight() {
        return this._bodyHeight;
    }
    /**
     * Returns if selection is enabled.
     * @return {?}
     */
    get selectEnabled() {
        return !!this.selectionType;
    }
    /**
     * Property that would calculate the height of scroll bar
     * based on the row heights cache for virtual scroll and virtualization. Other scenarios
     * calculate scroll height automatically (as height will be undefined).
     * @return {?}
     */
    get scrollHeight() {
        if (this.scrollbarV && this.virtualization && this.rowCount) {
            return this.rowHeightsCache.query(this.rowCount - 1);
        }
        // avoid TS7030: Not all code paths return a value.
        return undefined;
    }
    /**
     * Called after the constructor, initializing input properties
     * @return {?}
     */
    ngOnInit() {
        if (this.rowDetail) {
            this.listener = this.rowDetail.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ type, value }) => {
                if (type === 'row') {
                    this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                this.updateIndexes();
                this.updateRows();
                this.cd.markForCheck();
            }));
        }
        if (this.groupHeader) {
            this.listener = this.groupHeader.toggle.subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ({ type, value }) => {
                if (type === 'group') {
                    this.toggleRowExpansion(value);
                }
                if (type === 'all') {
                    this.toggleAllRows(value);
                }
                // Refresh rows after toggle
                // Fixes #883
                this.updateIndexes();
                this.updateRows();
                this.cd.markForCheck();
            }));
        }
    }
    /**
     * Called once, before the instance is destroyed.
     * @return {?}
     */
    ngOnDestroy() {
        if (this.rowDetail || this.groupHeader) {
            this.listener.unsubscribe();
        }
    }
    /**
     * Updates the Y offset given a new offset.
     * @param {?=} offset
     * @return {?}
     */
    updateOffsetY(offset) {
        // scroller is missing on empty table
        if (!this.scroller) {
            return;
        }
        if (this.scrollbarV && this.virtualization && offset) {
            // First get the row Index that we need to move to.
            /** @type {?} */
            const rowIndex = this.pageSize * offset;
            offset = this.rowHeightsCache.query(rowIndex - 1);
        }
        else if (this.scrollbarV && !this.virtualization) {
            offset = 0;
        }
        this.scroller.setOffset(offset || 0);
    }
    /**
     * Body was scrolled, this is mainly useful for
     * when a user is server-side pagination via virtual scroll.
     * @param {?} event
     * @return {?}
     */
    onBodyScroll(event) {
        /** @type {?} */
        const scrollYPos = event.scrollYPos;
        /** @type {?} */
        const scrollXPos = event.scrollXPos;
        // if scroll change, trigger update
        // this is mainly used for header cell positions
        if (this.offsetY !== scrollYPos || this.offsetX !== scrollXPos) {
            this.scroll.emit({
                offsetY: scrollYPos,
                offsetX: scrollXPos
            });
        }
        this.offsetY = scrollYPos;
        this.offsetX = scrollXPos;
        this.updateIndexes();
        this.updatePage(event.direction);
        this.updateRows();
    }
    /**
     * Emit when a new row is added
     * @param {?} event
     * @return {?}
     */
    onRowInited(event) {
        this.rowInited.emit(event);
    }
    /**
     * Updates the page given a direction.
     * @param {?} direction
     * @return {?}
     */
    updatePage(direction) {
        /** @type {?} */
        let offset = this.indexes.first / this.pageSize;
        if (direction === 'up') {
            offset = Math.ceil(offset);
        }
        else if (direction === 'down') {
            offset = Math.floor(offset);
        }
        if (direction !== undefined && !isNaN(offset)) {
            this.page.emit({ offset });
        }
    }
    /**
     * Updates the rows in the view port
     * @return {?}
     */
    updateRows() {
        const { first, last } = this.indexes;
        /** @type {?} */
        let rowIndex = first;
        /** @type {?} */
        let idx = 0;
        /** @type {?} */
        const temp = [];
        this.rowIndexes.clear();
        // if grouprowsby has been specified treat row paging
        // parameters as group paging parameters ie if limit 10 has been
        // specified treat it as 10 groups rather than 10 rows
        if (this.groupedRows) {
            /** @type {?} */
            let maxRowsPerGroup = 3;
            // if there is only one group set the maximum number of
            // rows per group the same as the total number of rows
            if (this.groupedRows.length === 1) {
                maxRowsPerGroup = this.groupedRows[0].value.length;
            }
            while (rowIndex < last && rowIndex < this.groupedRows.length) {
                // Add the groups into this page
                /** @type {?} */
                const group = this.groupedRows[rowIndex];
                temp[idx] = group;
                idx++;
                // Group index in this context
                rowIndex++;
            }
        }
        else {
            while (rowIndex < last && rowIndex < this.rowCount) {
                /** @type {?} */
                const row = this.rows[rowIndex];
                if (row) {
                    this.rowIndexes.set(row, rowIndex);
                    temp[idx] = row;
                }
                idx++;
                rowIndex++;
            }
        }
        this.temp = temp;
    }
    /**
     * Get the row height
     * @param {?} row
     * @return {?}
     */
    getRowHeight(row) {
        // if its a function return it
        if (typeof this.rowHeight === 'function') {
            return this.rowHeight(row);
        }
        return (/** @type {?} */ (this.rowHeight));
    }
    /**
     * @param {?} group the group with all rows
     * @return {?}
     */
    getGroupHeight(group) {
        /** @type {?} */
        let rowHeight = 0;
        if (group.value) {
            for (let index = 0; index < group.value.length; index++) {
                rowHeight += this.getRowAndDetailHeight(group.value[index]);
            }
        }
        return rowHeight;
    }
    /**
     * Calculate row height based on the expanded state of the row.
     * @param {?} row
     * @return {?}
     */
    getRowAndDetailHeight(row) {
        /** @type {?} */
        let rowHeight = this.getRowHeight(row);
        /** @type {?} */
        const expanded = this.rowExpansions.get(row);
        // Adding detail row height if its expanded.
        if (expanded === 1) {
            rowHeight += this.getDetailRowHeight(row);
        }
        return rowHeight;
    }
    /**
     * Calculates the styles for the row so that the rows can be moved in 2D space
     * during virtual scroll inside the DOM.   In the below case the Y position is
     * manipulated.   As an example, if the height of row 0 is 30 px and row 1 is
     * 100 px then following styles are generated:
     *
     * transform: translate3d(0px, 0px, 0px);    ->  row0
     * transform: translate3d(0px, 30px, 0px);   ->  row1
     * transform: translate3d(0px, 130px, 0px);  ->  row2
     *
     * Row heights have to be calculated based on the row heights cache as we wont
     * be able to determine which row is of what height before hand.  In the above
     * case the positionY of the translate3d for row2 would be the sum of all the
     * heights of the rows before it (i.e. row0 and row1).
     *
     * \@memberOf DataTableBodyComponent
     * @param {?} rows the row that needs to be placed in the 2D space.
     * @return {?} the CSS3 style to be applied
     *
     */
    getRowsStyles(rows) {
        /** @type {?} */
        const styles = {};
        // only add styles for the group if there is a group
        if (this.groupedRows) {
            styles.width = this.columnGroupWidths.total;
        }
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            let idx = 0;
            if (this.groupedRows) {
                // Get the latest row rowindex in a group
                /** @type {?} */
                const row = rows[rows.length - 1];
                idx = row ? this.getRowIndex(row) : 0;
            }
            else {
                idx = this.getRowIndex(rows);
            }
            // const pos = idx * rowHeight;
            // The position of this row would be the sum of all row heights
            // until the previous row position.
            /** @type {?} */
            const pos = this.rowHeightsCache.query(idx - 1);
            translateXY(styles, 0, pos);
        }
        return styles;
    }
    /**
     * Calculate bottom summary row offset for scrollbar mode.
     * For more information about cache and offset calculation
     * see description for `getRowsStyles` method
     *
     * \@memberOf DataTableBodyComponent
     * @return {?} the CSS3 style to be applied
     *
     */
    getBottomSummaryRowStyles() {
        if (!this.scrollbarV || !this.rows || !this.rows.length) {
            return null;
        }
        /** @type {?} */
        const styles = { position: 'absolute' };
        /** @type {?} */
        const pos = this.rowHeightsCache.query(this.rows.length - 1);
        translateXY(styles, 0, pos);
        return styles;
    }
    /**
     * Hides the loading indicator
     * @return {?}
     */
    hideIndicator() {
        setTimeout((/**
         * @return {?}
         */
        () => (this.loadingIndicator = false)), 500);
    }
    /**
     * Updates the index of the rows in the viewport
     * @return {?}
     */
    updateIndexes() {
        /** @type {?} */
        let first = 0;
        /** @type {?} */
        let last = 0;
        if (this.scrollbarV) {
            if (this.virtualization) {
                // Calculation of the first and last indexes will be based on where the
                // scrollY position would be at.  The last index would be the one
                // that shows up inside the view port the last.
                /** @type {?} */
                const height = parseInt(this.bodyHeight, 0);
                first = this.rowHeightsCache.getRowIndex(this.offsetY);
                last = this.rowHeightsCache.getRowIndex(height + this.offsetY) + 1;
            }
            else {
                // If virtual rows are not needed
                // We render all in one go
                first = 0;
                last = this.rowCount;
            }
        }
        else {
            // The server is handling paging and will pass an array that begins with the
            // element at a specified offset.  first should always be 0 with external paging.
            if (!this.externalPaging) {
                first = Math.max(this.offset * this.pageSize, 0);
            }
            last = Math.min(first + this.pageSize, this.rowCount);
        }
        this.indexes = { first, last };
    }
    /**
     * Refreshes the full Row Height cache.  Should be used
     * when the entire row array state has changed.
     * @return {?}
     */
    refreshRowHeightCache() {
        if (!this.scrollbarV || (this.scrollbarV && !this.virtualization)) {
            return;
        }
        // clear the previous row height cache if already present.
        // this is useful during sorts, filters where the state of the
        // rows array is changed.
        this.rowHeightsCache.clearCache();
        // Initialize the tree only if there are rows inside the tree.
        if (this.rows && this.rows.length) {
            this.rowHeightsCache.initCache({
                rows: this.rows,
                rowHeight: this.rowHeight,
                detailRowHeight: this.getDetailRowHeight,
                externalVirtual: this.scrollbarV && this.externalPaging,
                rowCount: this.rowCount,
                rowIndexes: this.rowIndexes,
                rowExpansions: this.rowExpansions
            });
        }
    }
    /**
     * Gets the index for the view port
     * @return {?}
     */
    getAdjustedViewPortIndex() {
        // Capture the row index of the first row that is visible on the viewport.
        // If the scroll bar is just below the row which is highlighted then make that as the
        // first index.
        /** @type {?} */
        const viewPortFirstRowIndex = this.indexes.first;
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            const offsetScroll = this.rowHeightsCache.query(viewPortFirstRowIndex - 1);
            return offsetScroll <= this.offsetY ? viewPortFirstRowIndex - 1 : viewPortFirstRowIndex;
        }
        return viewPortFirstRowIndex;
    }
    /**
     * Toggle the Expansion of the row i.e. if the row is expanded then it will
     * collapse and vice versa.   Note that the expanded status is stored as
     * a part of the row object itself as we have to preserve the expanded row
     * status in case of sorting and filtering of the row set.
     * @param {?} row
     * @return {?}
     */
    toggleRowExpansion(row) {
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        /** @type {?} */
        let expanded = this.rowExpansions.get(row);
        // If the detailRowHeight is auto --> only in case of non-virtualized scroll
        if (this.scrollbarV && this.virtualization) {
            /** @type {?} */
            const detailRowHeight = this.getDetailRowHeight(row) * (expanded ? -1 : 1);
            // const idx = this.rowIndexes.get(row) || 0;
            /** @type {?} */
            const idx = this.getRowIndex(row);
            this.rowHeightsCache.update(idx, detailRowHeight);
        }
        // Update the toggled row and update thive nevere heights in the cache.
        expanded = expanded ^= 1;
        this.rowExpansions.set(row, expanded);
        this.detailToggle.emit({
            rows: [row],
            currentIndex: viewPortFirstRowIndex
        });
    }
    /**
     * Expand/Collapse all the rows no matter what their state is.
     * @param {?} expanded
     * @return {?}
     */
    toggleAllRows(expanded) {
        // clear prev expansions
        this.rowExpansions.clear();
        /** @type {?} */
        const rowExpanded = expanded ? 1 : 0;
        // Capture the row index of the first row that is visible on the viewport.
        /** @type {?} */
        const viewPortFirstRowIndex = this.getAdjustedViewPortIndex();
        for (const row of this.rows) {
            this.rowExpansions.set(row, rowExpanded);
        }
        if (this.scrollbarV) {
            // Refresh the full row heights cache since every row was affected.
            this.recalcLayout();
        }
        // Emit all rows that have been expanded.
        this.detailToggle.emit({
            rows: this.rows,
            currentIndex: viewPortFirstRowIndex
        });
    }
    /**
     * Recalculates the table
     * @return {?}
     */
    recalcLayout() {
        this.refreshRowHeightCache();
        this.updateIndexes();
        this.updateRows();
    }
    /**
     * Tracks the column
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    columnTrackingFn(index, column) {
        return column.$$id;
    }
    /**
     * Gets the row pinning group styles
     * @param {?} group
     * @return {?}
     */
    stylesByGroup(group) {
        /** @type {?} */
        const widths = this.columnGroupWidths;
        /** @type {?} */
        const offsetX = this.offsetX;
        /** @type {?} */
        const styles = {
            width: `${widths[group]}px`
        };
        if (group === 'left') {
            translateXY(styles, offsetX, 0);
        }
        else if (group === 'right') {
            /** @type {?} */
            const bodyWidth = parseInt(this.innerWidth + '', 0);
            /** @type {?} */
            const totalDiff = widths.total - bodyWidth;
            /** @type {?} */
            const offsetDiff = totalDiff - offsetX;
            /** @type {?} */
            const offset = offsetDiff * -1;
            translateXY(styles, offset, 0);
        }
        return styles;
    }
    /**
     * Returns if the row was expanded and set default row expansion when row expansion is empty
     * @param {?} row
     * @return {?}
     */
    getRowExpanded(row) {
        if (this.rowExpansions.size === 0 && this.groupExpansionDefault) {
            for (const group of this.groupedRows) {
                this.rowExpansions.set(group, 1);
            }
        }
        /** @type {?} */
        const expanded = this.rowExpansions.get(row);
        return expanded === 1;
    }
    /**
     * Gets the row index given a row
     * @param {?} row
     * @return {?}
     */
    getRowIndex(row) {
        return this.rowIndexes.get(row) || 0;
    }
    /**
     * @param {?} row
     * @return {?}
     */
    onTreeAction(row) {
        this.treeAction.emit({ row });
    }
}
DataTableBodyComponent.decorators = [
    { type: Component, args: [{
                selector: 'datatable-body',
                template: `
    <datatable-selection
      #selector
      [selected]="selected"
      [rows]="rows"
      [selectCheck]="selectCheck"
      [selectEnabled]="selectEnabled"
      [selectionType]="selectionType"
      [rowIdentity]="rowIdentity"
      (select)="select.emit($event)"
      (activate)="activate.emit($event)"
    >
      <datatable-progress *ngIf="loadingIndicator"> </datatable-progress>
      <datatable-scroller
        *ngIf="rows?.length"
        [scrollbarV]="scrollbarV"
        [scrollbarH]="scrollbarH"
        [scrollHeight]="scrollHeight"
        [scrollWidth]="columnGroupWidths?.total"
        (scroll)="onBodyScroll($event)"
      >
        <datatable-summary-row
          *ngIf="summaryRow && summaryPosition === 'top'"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
        <datatable-row-wrapper
          [groupedRows]="groupedRows"
          *ngFor="let group of temp; let i = index; trackBy: rowTrackingFn"
          [innerWidth]="innerWidth"
          [ngStyle]="getRowsStyles(group)"
          [rowDetail]="rowDetail"
          [groupHeader]="groupHeader"
          [offsetX]="offsetX"
          [detailRowHeight]="getDetailRowHeight(group[i], i)"
          [row]="group"
          [expanded]="getRowExpanded(group)"
          [rowIndex]="getRowIndex(group[i])"
          (rowContextmenu)="rowContextmenu.emit($event)"
        >
          <datatable-body-row
            *ngIf="!groupedRows; else groupedRowsTemplate"
            tabindex="-1"
            [isSelected]="selector.getRowSelected(group)"
            [innerWidth]="innerWidth"
            [offsetX]="offsetX"
            [columns]="columns"
            [rowHeight]="getRowHeight(group)"
            [row]="group"
            [rowIndex]="getRowIndex(group)"
            [expanded]="getRowExpanded(group)"
            [rowClass]="rowClass"
            [displayCheck]="displayCheck"
            [treeStatus]="group.treeStatus"
            (treeAction)="onTreeAction(group)"
            (activate)="selector.onActivate($event, indexes.first + i)"
            (rowInited)="onRowInited($event)"
          >
          </datatable-body-row>
          <ng-template #groupedRowsTemplate>
            <datatable-body-row
              *ngFor="let row of group.value; let i = index; trackBy: rowTrackingFn"
              tabindex="-1"
              [isSelected]="selector.getRowSelected(row)"
              [innerWidth]="innerWidth"
              [offsetX]="offsetX"
              [columns]="columns"
              [rowHeight]="getRowHeight(row)"
              [row]="row"
              [group]="group.value"
              [rowIndex]="getRowIndex(row)"
              [expanded]="getRowExpanded(row)"
              [rowClass]="rowClass"
              (activate)="selector.onActivate($event, i)"
              (rowInited)="onRowInited($event)"
            >
            </datatable-body-row>
          </ng-template>
        </datatable-row-wrapper>
        <datatable-summary-row
          *ngIf="summaryRow && summaryPosition === 'bottom'"
          [ngStyle]="getBottomSummaryRowStyles()"
          [rowHeight]="summaryHeight"
          [offsetX]="offsetX"
          [innerWidth]="innerWidth"
          [rows]="rows"
          [columns]="columns"
        >
        </datatable-summary-row>
      </datatable-scroller>
      <div class="empty-row" *ngIf="!rows?.length && !loadingIndicator" [innerHTML]="emptyMessage"></div>
    </datatable-selection>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    class: 'datatable-body'
                }
            }] }
];
/** @nocollapse */
DataTableBodyComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
DataTableBodyComponent.propDecorators = {
    scrollbarV: [{ type: Input }],
    scrollbarH: [{ type: Input }],
    loadingIndicator: [{ type: Input }],
    externalPaging: [{ type: Input }],
    rowHeight: [{ type: Input }],
    offsetX: [{ type: Input }],
    emptyMessage: [{ type: Input }],
    selectionType: [{ type: Input }],
    selected: [{ type: Input }],
    rowIdentity: [{ type: Input }],
    rowDetail: [{ type: Input }],
    groupHeader: [{ type: Input }],
    selectCheck: [{ type: Input }],
    displayCheck: [{ type: Input }],
    trackByProp: [{ type: Input }],
    rowClass: [{ type: Input }],
    groupedRows: [{ type: Input }],
    groupExpansionDefault: [{ type: Input }],
    innerWidth: [{ type: Input }],
    groupRowsBy: [{ type: Input }],
    virtualization: [{ type: Input }],
    summaryRow: [{ type: Input }],
    summaryPosition: [{ type: Input }],
    summaryHeight: [{ type: Input }],
    pageSize: [{ type: Input }],
    rows: [{ type: Input }],
    columns: [{ type: Input }],
    offset: [{ type: Input }],
    rowCount: [{ type: Input }],
    bodyWidth: [{ type: HostBinding, args: ['style.width',] }],
    bodyHeight: [{ type: Input }, { type: HostBinding, args: ['style.height',] }],
    scroll: [{ type: Output }],
    page: [{ type: Output }],
    activate: [{ type: Output }],
    select: [{ type: Output }],
    detailToggle: [{ type: Output }],
    rowContextmenu: [{ type: Output }],
    treeAction: [{ type: Output }],
    rowInited: [{ type: Output }],
    scroller: [{ type: ViewChild, args: [ScrollerComponent, { static: false },] }]
};
if (false) {
    /** @type {?} */
    DataTableBodyComponent.prototype.scrollbarV;
    /** @type {?} */
    DataTableBodyComponent.prototype.scrollbarH;
    /** @type {?} */
    DataTableBodyComponent.prototype.loadingIndicator;
    /** @type {?} */
    DataTableBodyComponent.prototype.externalPaging;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype.offsetX;
    /** @type {?} */
    DataTableBodyComponent.prototype.emptyMessage;
    /** @type {?} */
    DataTableBodyComponent.prototype.selectionType;
    /** @type {?} */
    DataTableBodyComponent.prototype.selected;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowIdentity;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowDetail;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupHeader;
    /** @type {?} */
    DataTableBodyComponent.prototype.selectCheck;
    /** @type {?} */
    DataTableBodyComponent.prototype.displayCheck;
    /** @type {?} */
    DataTableBodyComponent.prototype.trackByProp;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowClass;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupedRows;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupExpansionDefault;
    /** @type {?} */
    DataTableBodyComponent.prototype.innerWidth;
    /** @type {?} */
    DataTableBodyComponent.prototype.groupRowsBy;
    /** @type {?} */
    DataTableBodyComponent.prototype.virtualization;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryRow;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryPosition;
    /** @type {?} */
    DataTableBodyComponent.prototype.summaryHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype.scroll;
    /** @type {?} */
    DataTableBodyComponent.prototype.page;
    /** @type {?} */
    DataTableBodyComponent.prototype.activate;
    /** @type {?} */
    DataTableBodyComponent.prototype.select;
    /** @type {?} */
    DataTableBodyComponent.prototype.detailToggle;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowContextmenu;
    /** @type {?} */
    DataTableBodyComponent.prototype.treeAction;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowInited;
    /** @type {?} */
    DataTableBodyComponent.prototype.scroller;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowHeightsCache;
    /** @type {?} */
    DataTableBodyComponent.prototype.temp;
    /** @type {?} */
    DataTableBodyComponent.prototype.offsetY;
    /** @type {?} */
    DataTableBodyComponent.prototype.indexes;
    /** @type {?} */
    DataTableBodyComponent.prototype.columnGroupWidths;
    /** @type {?} */
    DataTableBodyComponent.prototype.columnGroupWidthsWithoutGroup;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowTrackingFn;
    /** @type {?} */
    DataTableBodyComponent.prototype.listener;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowIndexes;
    /** @type {?} */
    DataTableBodyComponent.prototype.rowExpansions;
    /** @type {?} */
    DataTableBodyComponent.prototype._rows;
    /** @type {?} */
    DataTableBodyComponent.prototype._bodyHeight;
    /** @type {?} */
    DataTableBodyComponent.prototype._columns;
    /** @type {?} */
    DataTableBodyComponent.prototype._rowCount;
    /** @type {?} */
    DataTableBodyComponent.prototype._offset;
    /** @type {?} */
    DataTableBodyComponent.prototype._pageSize;
    /**
     * Get the height of the detail row.
     * @type {?}
     */
    DataTableBodyComponent.prototype.getDetailRowHeight;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyComponent.prototype.cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsV0FBVyxFQUNYLGlCQUFpQixFQUNqQixTQUFTLEVBR1QsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQTBHcEQsTUFBTSxPQUFPLHNCQUFzQjs7Ozs7SUFzSmpDLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBN0loQyxhQUFRLEdBQVUsRUFBRSxDQUFDO1FBeUZwQixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsU0FBSSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdDLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNqRCxXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsaUJBQVksR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFrQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbkQsY0FBUyxHQUFzQixJ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SUFDN0IsNENBQTZCOztJQUM3QixrREFBbUM7O0lBQ25DLGdEQUFpQzs7SUFDakMsMkNBQThEOztJQUM5RCx5Q0FBeUI7O0lBQ3pCLDhDQUE4Qjs7SUFDOUIsK0NBQXNDOztJQUN0QywwQ0FBOEI7O0lBQzlCLDZDQUEwQjs7SUFDMUIsMkNBQXdCOztJQUN4Qiw2Q0FBMEI7O0lBQzFCLDZDQUEwQjs7SUFDMUIsOENBQTJCOztJQUMzQiw2Q0FBNkI7O0lBQzdCLDBDQUF1Qjs7SUFDdkIsNkNBQTBCOztJQUMxQix1REFBd0M7O0lBQ3hDLDRDQUE0Qjs7SUFDNUIsNkNBQTZCOztJQUM3QixnREFBaUM7O0lBQ2pDLDRDQUE2Qjs7SUFDN0IsaURBQWlDOztJQUNqQywrQ0FBK0I7O0lBMEUvQix3Q0FBeUQ7O0lBQ3pELHNDQUF1RDs7SUFDdkQsMENBQTJEOztJQUMzRCx3Q0FBeUQ7O0lBQ3pELDhDQUErRDs7SUFDL0QsZ0RBQW9GOztJQUNwRiw0Q0FBNkQ7O0lBQzdELDJDQUE0RDs7SUFFNUQsMENBQTZFOztJQXNCN0UsaURBQXVEOztJQUN2RCxzQ0FBaUI7O0lBQ2pCLHlDQUFZOztJQUNaLHlDQUFrQjs7SUFDbEIsbURBQXVCOztJQUN2QiwrREFBbUM7O0lBQ25DLCtDQUFtQjs7SUFDbkIsMENBQWM7O0lBQ2QsNENBQTRCOztJQUM1QiwrQ0FBK0I7O0lBRS9CLHVDQUFhOztJQUNiLDZDQUFpQjs7SUFDakIsMENBQWdCOztJQUNoQiwyQ0FBa0I7O0lBQ2xCLHlDQUFnQjs7SUFDaEIsMkNBQWtCOzs7OztJQW1PbEIsb0RBTUU7Ozs7O0lBcE9VLG9DQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBIb3N0QmluZGluZyxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIFZpZXdDaGlsZCxcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2Nyb2xsZXJDb21wb25lbnQgfSBmcm9tICcuL3Njcm9sbGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNb3VzZUV2ZW50IH0gZnJvbSAnLi4vLi4vZXZlbnRzJztcbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9zZWxlY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBjb2x1bW5zQnlQaW4sIGNvbHVtbkdyb3VwV2lkdGhzIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29sdW1uJztcbmltcG9ydCB7IFJvd0hlaWdodENhY2hlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm93LWhlaWdodC1jYWNoZSc7XG5pbXBvcnQgeyB0cmFuc2xhdGVYWSB9IGZyb20gJy4uLy4uL3V0aWxzL3RyYW5zbGF0ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2RhdGF0YWJsZS1ib2R5JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGF0YXRhYmxlLXNlbGVjdGlvblxuICAgICAgI3NlbGVjdG9yXG4gICAgICBbc2VsZWN0ZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgW3Jvd3NdPVwicm93c1wiXG4gICAgICBbc2VsZWN0Q2hlY2tdPVwic2VsZWN0Q2hlY2tcIlxuICAgICAgW3NlbGVjdEVuYWJsZWRdPVwic2VsZWN0RW5hYmxlZFwiXG4gICAgICBbc2VsZWN0aW9uVHlwZV09XCJzZWxlY3Rpb25UeXBlXCJcbiAgICAgIFtyb3dJZGVudGl0eV09XCJyb3dJZGVudGl0eVwiXG4gICAgICAoc2VsZWN0KT1cInNlbGVjdC5lbWl0KCRldmVudClcIlxuICAgICAgKGFjdGl2YXRlKT1cImFjdGl2YXRlLmVtaXQoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPGRhdGF0YWJsZS1wcm9ncmVzcyAqbmdJZj1cImxvYWRpbmdJbmRpY2F0b3JcIj4gPC9kYXRhdGFibGUtcHJvZ3Jlc3M+XG4gICAgICA8ZGF0YXRhYmxlLXNjcm9sbGVyXG4gICAgICAgICpuZ0lmPVwicm93cz8ubGVuZ3RoXCJcbiAgICAgICAgW3Njcm9sbGJhclZdPVwic2Nyb2xsYmFyVlwiXG4gICAgICAgIFtzY3JvbGxiYXJIXT1cInNjcm9sbGJhckhcIlxuICAgICAgICBbc2Nyb2xsSGVpZ2h0XT1cInNjcm9sbEhlaWdodFwiXG4gICAgICAgIFtzY3JvbGxXaWR0aF09XCJjb2x1bW5Hcm91cFdpZHRocz8udG90YWxcIlxuICAgICAgICAoc2Nyb2xsKT1cIm9uQm9keVNjcm9sbCgkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgICAgPGRhdGF0YWJsZS1zdW1tYXJ5LXJvd1xuICAgICAgICAgICpuZ0lmPVwic3VtbWFyeVJvdyAmJiBzdW1tYXJ5UG9zaXRpb24gPT09ICd0b3AnXCJcbiAgICAgICAgICBbcm93SGVpZ2h0XT1cInN1bW1hcnlIZWlnaHRcIlxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxuICAgICAgICA+XG4gICAgICAgIDwvZGF0YXRhYmxlLXN1bW1hcnktcm93PlxuICAgICAgICA8ZGF0YXRhYmxlLXJvdy13cmFwcGVyXG4gICAgICAgICAgW2dyb3VwZWRSb3dzXT1cImdyb3VwZWRSb3dzXCJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgZ3JvdXAgb2YgdGVtcDsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogcm93VHJhY2tpbmdGblwiXG4gICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXG4gICAgICAgICAgW25nU3R5bGVdPVwiZ2V0Um93c1N0eWxlcyhncm91cClcIlxuICAgICAgICAgIFtyb3dEZXRhaWxdPVwicm93RGV0YWlsXCJcbiAgICAgICAgICBbZ3JvdXBIZWFkZXJdPVwiZ3JvdXBIZWFkZXJcIlxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgIFtkZXRhaWxSb3dIZWlnaHRdPVwiZ2V0RGV0YWlsUm93SGVpZ2h0KGdyb3VwW2ldLCBpKVwiXG4gICAgICAgICAgW3Jvd109XCJncm91cFwiXG4gICAgICAgICAgW2V4cGFuZGVkXT1cImdldFJvd0V4cGFuZGVkKGdyb3VwKVwiXG4gICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KGdyb3VwW2ldKVwiXG4gICAgICAgICAgKHJvd0NvbnRleHRtZW51KT1cInJvd0NvbnRleHRtZW51LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgID5cbiAgICAgICAgICA8ZGF0YXRhYmxlLWJvZHktcm93XG4gICAgICAgICAgICAqbmdJZj1cIiFncm91cGVkUm93czsgZWxzZSBncm91cGVkUm93c1RlbXBsYXRlXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgW2lzU2VsZWN0ZWRdPVwic2VsZWN0b3IuZ2V0Um93U2VsZWN0ZWQoZ3JvdXApXCJcbiAgICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgICAgICAgW29mZnNldFhdPVwib2Zmc2V0WFwiXG4gICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgICAgIFtyb3dIZWlnaHRdPVwiZ2V0Um93SGVpZ2h0KGdyb3VwKVwiXG4gICAgICAgICAgICBbcm93XT1cImdyb3VwXCJcbiAgICAgICAgICAgIFtyb3dJbmRleF09XCJnZXRSb3dJbmRleChncm91cClcIlxuICAgICAgICAgICAgW2V4cGFuZGVkXT1cImdldFJvd0V4cGFuZGVkKGdyb3VwKVwiXG4gICAgICAgICAgICBbcm93Q2xhc3NdPVwicm93Q2xhc3NcIlxuICAgICAgICAgICAgW2Rpc3BsYXlDaGVja109XCJkaXNwbGF5Q2hlY2tcIlxuICAgICAgICAgICAgW3RyZWVTdGF0dXNdPVwiZ3JvdXAudHJlZVN0YXR1c1wiXG4gICAgICAgICAgICAodHJlZUFjdGlvbik9XCJvblRyZWVBY3Rpb24oZ3JvdXApXCJcbiAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJzZWxlY3Rvci5vbkFjdGl2YXRlKCRldmVudCwgaW5kZXhlcy5maXJzdCArIGkpXCJcbiAgICAgICAgICAgIChyb3dJbml0ZWQpPVwib25Sb3dJbml0ZWQoJGV2ZW50KVwiXG4gICAgICAgICAgPlxuICAgICAgICAgIDwvZGF0YXRhYmxlLWJvZHktcm93PlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZ3JvdXBlZFJvd3NUZW1wbGF0ZT5cbiAgICAgICAgICAgIDxkYXRhdGFibGUtYm9keS1yb3dcbiAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IHJvdyBvZiBncm91cC52YWx1ZTsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogcm93VHJhY2tpbmdGblwiXG4gICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICBbaXNTZWxlY3RlZF09XCJzZWxlY3Rvci5nZXRSb3dTZWxlY3RlZChyb3cpXCJcbiAgICAgICAgICAgICAgW2lubmVyV2lkdGhdPVwiaW5uZXJXaWR0aFwiXG4gICAgICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgICAgICBbY29sdW1uc109XCJjb2x1bW5zXCJcbiAgICAgICAgICAgICAgW3Jvd0hlaWdodF09XCJnZXRSb3dIZWlnaHQocm93KVwiXG4gICAgICAgICAgICAgIFtyb3ddPVwicm93XCJcbiAgICAgICAgICAgICAgW2dyb3VwXT1cImdyb3VwLnZhbHVlXCJcbiAgICAgICAgICAgICAgW3Jvd0luZGV4XT1cImdldFJvd0luZGV4KHJvdylcIlxuICAgICAgICAgICAgICBbZXhwYW5kZWRdPVwiZ2V0Um93RXhwYW5kZWQocm93KVwiXG4gICAgICAgICAgICAgIFtyb3dDbGFzc109XCJyb3dDbGFzc1wiXG4gICAgICAgICAgICAgIChhY3RpdmF0ZSk9XCJzZWxlY3Rvci5vbkFjdGl2YXRlKCRldmVudCwgaSlcIlxuICAgICAgICAgICAgICAocm93SW5pdGVkKT1cIm9uUm93SW5pdGVkKCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9kYXRhdGFibGUtYm9keS1yb3c+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kYXRhdGFibGUtcm93LXdyYXBwZXI+XG4gICAgICAgIDxkYXRhdGFibGUtc3VtbWFyeS1yb3dcbiAgICAgICAgICAqbmdJZj1cInN1bW1hcnlSb3cgJiYgc3VtbWFyeVBvc2l0aW9uID09PSAnYm90dG9tJ1wiXG4gICAgICAgICAgW25nU3R5bGVdPVwiZ2V0Qm90dG9tU3VtbWFyeVJvd1N0eWxlcygpXCJcbiAgICAgICAgICBbcm93SGVpZ2h0XT1cInN1bW1hcnlIZWlnaHRcIlxuICAgICAgICAgIFtvZmZzZXRYXT1cIm9mZnNldFhcIlxuICAgICAgICAgIFtpbm5lcldpZHRoXT1cImlubmVyV2lkdGhcIlxuICAgICAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbnNcIlxuICAgICAgICA+XG4gICAgICAgIDwvZGF0YXRhYmxlLXN1bW1hcnktcm93PlxuICAgICAgPC9kYXRhdGFibGUtc2Nyb2xsZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1wdHktcm93XCIgKm5nSWY9XCIhcm93cz8ubGVuZ3RoICYmICFsb2FkaW5nSW5kaWNhdG9yXCIgW2lubmVySFRNTF09XCJlbXB0eU1lc3NhZ2VcIj48L2Rpdj5cbiAgICA8L2RhdGF0YWJsZS1zZWxlY3Rpb24+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdkYXRhdGFibGUtYm9keSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVCb2R5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBzY3JvbGxiYXJWOiBib29sZWFuO1xuICBASW5wdXQoKSBzY3JvbGxiYXJIOiBib29sZWFuO1xuICBASW5wdXQoKSBsb2FkaW5nSW5kaWNhdG9yOiBib29sZWFuO1xuICBASW5wdXQoKSBleHRlcm5hbFBhZ2luZzogYm9vbGVhbjtcbiAgQElucHV0KCkgcm93SGVpZ2h0OiBudW1iZXIgfCAnYXV0bycgfCAoKHJvdz86IGFueSkgPT4gbnVtYmVyKTtcbiAgQElucHV0KCkgb2Zmc2V0WDogbnVtYmVyO1xuICBASW5wdXQoKSBlbXB0eU1lc3NhZ2U6IHN0cmluZztcbiAgQElucHV0KCkgc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZTtcbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGFueVtdID0gW107XG4gIEBJbnB1dCgpIHJvd0lkZW50aXR5OiBhbnk7XG4gIEBJbnB1dCgpIHJvd0RldGFpbDogYW55O1xuICBASW5wdXQoKSBncm91cEhlYWRlcjogYW55O1xuICBASW5wdXQoKSBzZWxlY3RDaGVjazogYW55O1xuICBASW5wdXQoKSBkaXNwbGF5Q2hlY2s6IGFueTtcbiAgQElucHV0KCkgdHJhY2tCeVByb3A6IHN0cmluZztcbiAgQElucHV0KCkgcm93Q2xhc3M6IGFueTtcbiAgQElucHV0KCkgZ3JvdXBlZFJvd3M6IGFueTtcbiAgQElucHV0KCkgZ3JvdXBFeHBhbnNpb25EZWZhdWx0OiBib29sZWFuO1xuICBASW5wdXQoKSBpbm5lcldpZHRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIGdyb3VwUm93c0J5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZpcnR1YWxpemF0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKSBzdW1tYXJ5Um93OiBib29sZWFuO1xuICBASW5wdXQoKSBzdW1tYXJ5UG9zaXRpb246IHN0cmluZztcbiAgQElucHV0KCkgc3VtbWFyeUhlaWdodDogbnVtYmVyO1xuXG4gIEBJbnB1dCgpIHNldCBwYWdlU2l6ZSh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VTaXplID0gdmFsO1xuICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gIH1cblxuICBnZXQgcGFnZVNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZVNpemU7XG4gIH1cblxuICBASW5wdXQoKSBzZXQgcm93cyh2YWw6IGFueVtdKSB7XG4gICAgdGhpcy5fcm93cyA9IHZhbDtcbiAgICB0aGlzLnJvd0V4cGFuc2lvbnMuY2xlYXIoKTtcbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xuICB9XG5cbiAgZ2V0IHJvd3MoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG5cbiAgQElucHV0KCkgc2V0IGNvbHVtbnModmFsOiBhbnlbXSkge1xuICAgIHRoaXMuX2NvbHVtbnMgPSB2YWw7XG4gICAgY29uc3QgY29sc0J5UGluID0gY29sdW1uc0J5UGluKHZhbCk7XG4gICAgdGhpcy5jb2x1bW5Hcm91cFdpZHRocyA9IGNvbHVtbkdyb3VwV2lkdGhzKGNvbHNCeVBpbiwgdmFsKTtcbiAgfVxuXG4gIGdldCBjb2x1bW5zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBvZmZzZXQodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9vZmZzZXQgPSB2YWw7XG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xuICB9XG5cbiAgQElucHV0KCkgc2V0IHJvd0NvdW50KHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fcm93Q291bnQgPSB2YWw7XG4gICAgdGhpcy5yZWNhbGNMYXlvdXQoKTtcbiAgfVxuXG4gIGdldCByb3dDb3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3dDb3VudDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxuICBnZXQgYm9keVdpZHRoKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFySCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aCArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnMTAwJSc7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxuICBzZXQgYm9keUhlaWdodCh2YWwpIHtcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWKSB7XG4gICAgICB0aGlzLl9ib2R5SGVpZ2h0ID0gdmFsICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYm9keUhlaWdodCA9ICdhdXRvJztcbiAgICB9XG5cbiAgICB0aGlzLnJlY2FsY0xheW91dCgpO1xuICB9XG5cbiAgZ2V0IGJvZHlIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JvZHlIZWlnaHQ7XG4gIH1cblxuICBAT3V0cHV0KCkgc2Nyb2xsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHBhZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRldGFpbFRvZ2dsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSByb3dDb250ZXh0bWVudSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogTW91c2VFdmVudDsgcm93OiBhbnkgfT4oZmFsc2UpO1xuICBAT3V0cHV0KCkgdHJlZUFjdGlvbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSByb3dJbml0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoU2Nyb2xsZXJDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KSBzY3JvbGxlcjogU2Nyb2xsZXJDb21wb25lbnQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgc2VsZWN0aW9uIGlzIGVuYWJsZWQuXG4gICAqL1xuICBnZXQgc2VsZWN0RW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlbGVjdGlvblR5cGU7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGVydHkgdGhhdCB3b3VsZCBjYWxjdWxhdGUgdGhlIGhlaWdodCBvZiBzY3JvbGwgYmFyXG4gICAqIGJhc2VkIG9uIHRoZSByb3cgaGVpZ2h0cyBjYWNoZSBmb3IgdmlydHVhbCBzY3JvbGwgYW5kIHZpcnR1YWxpemF0aW9uLiBPdGhlciBzY2VuYXJpb3NcbiAgICogY2FsY3VsYXRlIHNjcm9sbCBoZWlnaHQgYXV0b21hdGljYWxseSAoYXMgaGVpZ2h0IHdpbGwgYmUgdW5kZWZpbmVkKS5cbiAgICovXG4gIGdldCBzY3JvbGxIZWlnaHQoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24gJiYgdGhpcy5yb3dDb3VudCkge1xuICAgICAgcmV0dXJuIHRoaXMucm93SGVpZ2h0c0NhY2hlLnF1ZXJ5KHRoaXMucm93Q291bnQgLSAxKTtcbiAgICB9XG4gICAgLy8gYXZvaWQgVFM3MDMwOiBOb3QgYWxsIGNvZGUgcGF0aHMgcmV0dXJuIGEgdmFsdWUuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJvd0hlaWdodHNDYWNoZTogUm93SGVpZ2h0Q2FjaGUgPSBuZXcgUm93SGVpZ2h0Q2FjaGUoKTtcbiAgdGVtcDogYW55W10gPSBbXTtcbiAgb2Zmc2V0WSA9IDA7XG4gIGluZGV4ZXM6IGFueSA9IHt9O1xuICBjb2x1bW5Hcm91cFdpZHRoczogYW55O1xuICBjb2x1bW5Hcm91cFdpZHRoc1dpdGhvdXRHcm91cDogYW55O1xuICByb3dUcmFja2luZ0ZuOiBhbnk7XG4gIGxpc3RlbmVyOiBhbnk7XG4gIHJvd0luZGV4ZXM6IGFueSA9IG5ldyBNYXAoKTtcbiAgcm93RXhwYW5zaW9uczogYW55ID0gbmV3IE1hcCgpO1xuXG4gIF9yb3dzOiBhbnlbXTtcbiAgX2JvZHlIZWlnaHQ6IGFueTtcbiAgX2NvbHVtbnM6IGFueVtdO1xuICBfcm93Q291bnQ6IG51bWJlcjtcbiAgX29mZnNldDogbnVtYmVyO1xuICBfcGFnZVNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBEYXRhVGFibGVCb2R5Q29tcG9uZW50LlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAvLyBkZWNsYXJlIGZuIGhlcmUgc28gd2UgY2FuIGdldCBhY2Nlc3MgdG8gdGhlIGB0aGlzYCBwcm9wZXJ0eVxuICAgIHRoaXMucm93VHJhY2tpbmdGbiA9IChpbmRleDogbnVtYmVyLCByb3c6IGFueSk6IGFueSA9PiB7XG4gICAgICBjb25zdCBpZHggPSB0aGlzLmdldFJvd0luZGV4KHJvdyk7XG4gICAgICBpZiAodGhpcy50cmFja0J5UHJvcCkge1xuICAgICAgICByZXR1cm4gcm93W3RoaXMudHJhY2tCeVByb3BdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgY29uc3RydWN0b3IsIGluaXRpYWxpemluZyBpbnB1dCBwcm9wZXJ0aWVzXG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3dEZXRhaWwpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIgPSB0aGlzLnJvd0RldGFpbC50b2dnbGUuc3Vic2NyaWJlKCh7IHR5cGUsIHZhbHVlIH06IHsgdHlwZTogc3RyaW5nOyB2YWx1ZTogYW55IH0pID0+IHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdyb3cnKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGVSb3dFeHBhbnNpb24odmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlQWxsUm93cyh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWZyZXNoIHJvd3MgYWZ0ZXIgdG9nZ2xlXG4gICAgICAgIC8vIEZpeGVzICM4ODNcbiAgICAgICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUm93cygpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ3JvdXBIZWFkZXIpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIgPSB0aGlzLmdyb3VwSGVhZGVyLnRvZ2dsZS5zdWJzY3JpYmUoKHsgdHlwZSwgdmFsdWUgfTogeyB0eXBlOiBzdHJpbmc7IHZhbHVlOiBhbnkgfSkgPT4ge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUm93RXhwYW5zaW9uKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZUFsbFJvd3ModmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVmcmVzaCByb3dzIGFmdGVyIHRvZ2dsZVxuICAgICAgICAvLyBGaXhlcyAjODgzXG4gICAgICAgIHRoaXMudXBkYXRlSW5kZXhlcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVJvd3MoKTtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgb25jZSwgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3dEZXRhaWwgfHwgdGhpcy5ncm91cEhlYWRlcikge1xuICAgICAgdGhpcy5saXN0ZW5lci51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBZIG9mZnNldCBnaXZlbiBhIG5ldyBvZmZzZXQuXG4gICAqL1xuICB1cGRhdGVPZmZzZXRZKG9mZnNldD86IG51bWJlcik6IHZvaWQge1xuICAgIC8vIHNjcm9sbGVyIGlzIG1pc3Npbmcgb24gZW1wdHkgdGFibGVcbiAgICBpZiAoIXRoaXMuc2Nyb2xsZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24gJiYgb2Zmc2V0KSB7XG4gICAgICAvLyBGaXJzdCBnZXQgdGhlIHJvdyBJbmRleCB0aGF0IHdlIG5lZWQgdG8gbW92ZSB0by5cbiAgICAgIGNvbnN0IHJvd0luZGV4ID0gdGhpcy5wYWdlU2l6ZSAqIG9mZnNldDtcbiAgICAgIG9mZnNldCA9IHRoaXMucm93SGVpZ2h0c0NhY2hlLnF1ZXJ5KHJvd0luZGV4IC0gMSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNjcm9sbGJhclYgJiYgIXRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgIG9mZnNldCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxlci5zZXRPZmZzZXQob2Zmc2V0IHx8IDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEJvZHkgd2FzIHNjcm9sbGVkLCB0aGlzIGlzIG1haW5seSB1c2VmdWwgZm9yXG4gICAqIHdoZW4gYSB1c2VyIGlzIHNlcnZlci1zaWRlIHBhZ2luYXRpb24gdmlhIHZpcnR1YWwgc2Nyb2xsLlxuICAgKi9cbiAgb25Cb2R5U2Nyb2xsKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBzY3JvbGxZUG9zOiBudW1iZXIgPSBldmVudC5zY3JvbGxZUG9zO1xuICAgIGNvbnN0IHNjcm9sbFhQb3M6IG51bWJlciA9IGV2ZW50LnNjcm9sbFhQb3M7XG5cbiAgICAvLyBpZiBzY3JvbGwgY2hhbmdlLCB0cmlnZ2VyIHVwZGF0ZVxuICAgIC8vIHRoaXMgaXMgbWFpbmx5IHVzZWQgZm9yIGhlYWRlciBjZWxsIHBvc2l0aW9uc1xuICAgIGlmICh0aGlzLm9mZnNldFkgIT09IHNjcm9sbFlQb3MgfHwgdGhpcy5vZmZzZXRYICE9PSBzY3JvbGxYUG9zKSB7XG4gICAgICB0aGlzLnNjcm9sbC5lbWl0KHtcbiAgICAgICAgb2Zmc2V0WTogc2Nyb2xsWVBvcyxcbiAgICAgICAgb2Zmc2V0WDogc2Nyb2xsWFBvc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5vZmZzZXRZID0gc2Nyb2xsWVBvcztcbiAgICB0aGlzLm9mZnNldFggPSBzY3JvbGxYUG9zO1xuXG4gICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XG4gICAgdGhpcy51cGRhdGVQYWdlKGV2ZW50LmRpcmVjdGlvbik7XG4gICAgdGhpcy51cGRhdGVSb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdCB3aGVuIGEgbmV3IHJvdyBpcyBhZGRlZFxuICAgKi9cbiAgb25Sb3dJbml0ZWQoZXZlbnQ6IGFueSk6dm9pZCB7XG4gICAgdGhpcy5yb3dJbml0ZWQuZW1pdChldmVudCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcGFnZSBnaXZlbiBhIGRpcmVjdGlvbi5cbiAgICovXG4gIHVwZGF0ZVBhZ2UoZGlyZWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5pbmRleGVzLmZpcnN0IC8gdGhpcy5wYWdlU2l6ZTtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcbiAgICAgIG9mZnNldCA9IE1hdGguY2VpbChvZmZzZXQpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgIG9mZnNldCA9IE1hdGguZmxvb3Iob2Zmc2V0KTtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG9mZnNldCkpIHtcbiAgICAgIHRoaXMucGFnZS5lbWl0KHsgb2Zmc2V0IH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSByb3dzIGluIHRoZSB2aWV3IHBvcnRcbiAgICovXG4gIHVwZGF0ZVJvd3MoKTogdm9pZCB7XG4gICAgY29uc3QgeyBmaXJzdCwgbGFzdCB9ID0gdGhpcy5pbmRleGVzO1xuICAgIGxldCByb3dJbmRleCA9IGZpcnN0O1xuICAgIGxldCBpZHggPSAwO1xuICAgIGNvbnN0IHRlbXA6IGFueVtdID0gW107XG5cbiAgICB0aGlzLnJvd0luZGV4ZXMuY2xlYXIoKTtcblxuICAgIC8vIGlmIGdyb3Vwcm93c2J5IGhhcyBiZWVuIHNwZWNpZmllZCB0cmVhdCByb3cgcGFnaW5nXG4gICAgLy8gcGFyYW1ldGVycyBhcyBncm91cCBwYWdpbmcgcGFyYW1ldGVycyBpZSBpZiBsaW1pdCAxMCBoYXMgYmVlblxuICAgIC8vIHNwZWNpZmllZCB0cmVhdCBpdCBhcyAxMCBncm91cHMgcmF0aGVyIHRoYW4gMTAgcm93c1xuICAgIGlmICh0aGlzLmdyb3VwZWRSb3dzKSB7XG4gICAgICBsZXQgbWF4Um93c1Blckdyb3VwID0gMztcbiAgICAgIC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lIGdyb3VwIHNldCB0aGUgbWF4aW11bSBudW1iZXIgb2ZcbiAgICAgIC8vIHJvd3MgcGVyIGdyb3VwIHRoZSBzYW1lIGFzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93c1xuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIG1heFJvd3NQZXJHcm91cCA9IHRoaXMuZ3JvdXBlZFJvd3NbMF0udmFsdWUubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocm93SW5kZXggPCBsYXN0ICYmIHJvd0luZGV4IDwgdGhpcy5ncm91cGVkUm93cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQWRkIHRoZSBncm91cHMgaW50byB0aGlzIHBhZ2VcbiAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwZWRSb3dzW3Jvd0luZGV4XTtcbiAgICAgICAgdGVtcFtpZHhdID0gZ3JvdXA7XG4gICAgICAgIGlkeCsrO1xuXG4gICAgICAgIC8vIEdyb3VwIGluZGV4IGluIHRoaXMgY29udGV4dFxuICAgICAgICByb3dJbmRleCsrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAocm93SW5kZXggPCBsYXN0ICYmIHJvd0luZGV4IDwgdGhpcy5yb3dDb3VudCkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLnJvd3Nbcm93SW5kZXhdO1xuXG4gICAgICAgIGlmIChyb3cpIHtcbiAgICAgICAgICB0aGlzLnJvd0luZGV4ZXMuc2V0KHJvdywgcm93SW5kZXgpO1xuICAgICAgICAgIHRlbXBbaWR4XSA9IHJvdztcbiAgICAgICAgfVxuXG4gICAgICAgIGlkeCsrO1xuICAgICAgICByb3dJbmRleCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGVtcCA9IHRlbXA7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSByb3cgaGVpZ2h0XG4gICAqL1xuICBnZXRSb3dIZWlnaHQocm93OiBhbnkpOiBudW1iZXIge1xuICAgIC8vIGlmIGl0cyBhIGZ1bmN0aW9uIHJldHVybiBpdFxuICAgIGlmICh0eXBlb2YgdGhpcy5yb3dIZWlnaHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvd0hlaWdodChyb3cpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJvd0hlaWdodCBhcyBudW1iZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGdyb3VwIHRoZSBncm91cCB3aXRoIGFsbCByb3dzXG4gICAqL1xuICBnZXRHcm91cEhlaWdodChncm91cDogYW55KTogbnVtYmVyIHtcbiAgICBsZXQgcm93SGVpZ2h0ID0gMDtcblxuICAgIGlmIChncm91cC52YWx1ZSkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGdyb3VwLnZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICByb3dIZWlnaHQgKz0gdGhpcy5nZXRSb3dBbmREZXRhaWxIZWlnaHQoZ3JvdXAudmFsdWVbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcm93SGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcm93LlxuICAgKi9cbiAgZ2V0Um93QW5kRGV0YWlsSGVpZ2h0KHJvdzogYW55KTogbnVtYmVyIHtcbiAgICBsZXQgcm93SGVpZ2h0ID0gdGhpcy5nZXRSb3dIZWlnaHQocm93KTtcbiAgICBjb25zdCBleHBhbmRlZCA9IHRoaXMucm93RXhwYW5zaW9ucy5nZXQocm93KTtcblxuICAgIC8vIEFkZGluZyBkZXRhaWwgcm93IGhlaWdodCBpZiBpdHMgZXhwYW5kZWQuXG4gICAgaWYgKGV4cGFuZGVkID09PSAxKSB7XG4gICAgICByb3dIZWlnaHQgKz0gdGhpcy5nZXREZXRhaWxSb3dIZWlnaHQocm93KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93SGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgaGVpZ2h0IG9mIHRoZSBkZXRhaWwgcm93LlxuICAgKi9cbiAgZ2V0RGV0YWlsUm93SGVpZ2h0ID0gKHJvdz86IGFueSwgaW5kZXg/OiBhbnkpOiBudW1iZXIgPT4ge1xuICAgIGlmICghdGhpcy5yb3dEZXRhaWwpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBjb25zdCByb3dIZWlnaHQgPSB0aGlzLnJvd0RldGFpbC5yb3dIZWlnaHQ7XG4gICAgcmV0dXJuIHR5cGVvZiByb3dIZWlnaHQgPT09ICdmdW5jdGlvbicgPyByb3dIZWlnaHQocm93LCBpbmRleCkgOiAocm93SGVpZ2h0IGFzIG51bWJlcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmb3IgdGhlIHJvdyBzbyB0aGF0IHRoZSByb3dzIGNhbiBiZSBtb3ZlZCBpbiAyRCBzcGFjZVxuICAgKiBkdXJpbmcgdmlydHVhbCBzY3JvbGwgaW5zaWRlIHRoZSBET00uICAgSW4gdGhlIGJlbG93IGNhc2UgdGhlIFkgcG9zaXRpb24gaXNcbiAgICogbWFuaXB1bGF0ZWQuICAgQXMgYW4gZXhhbXBsZSwgaWYgdGhlIGhlaWdodCBvZiByb3cgMCBpcyAzMCBweCBhbmQgcm93IDEgaXNcbiAgICogMTAwIHB4IHRoZW4gZm9sbG93aW5nIHN0eWxlcyBhcmUgZ2VuZXJhdGVkOlxuICAgKlxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMHB4LCAwcHgpOyAgICAtPiAgcm93MFxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMzBweCwgMHB4KTsgICAtPiAgcm93MVxuICAgKiB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDBweCwgMTMwcHgsIDBweCk7ICAtPiAgcm93MlxuICAgKlxuICAgKiBSb3cgaGVpZ2h0cyBoYXZlIHRvIGJlIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIHJvdyBoZWlnaHRzIGNhY2hlIGFzIHdlIHdvbnRcbiAgICogYmUgYWJsZSB0byBkZXRlcm1pbmUgd2hpY2ggcm93IGlzIG9mIHdoYXQgaGVpZ2h0IGJlZm9yZSBoYW5kLiAgSW4gdGhlIGFib3ZlXG4gICAqIGNhc2UgdGhlIHBvc2l0aW9uWSBvZiB0aGUgdHJhbnNsYXRlM2QgZm9yIHJvdzIgd291bGQgYmUgdGhlIHN1bSBvZiBhbGwgdGhlXG4gICAqIGhlaWdodHMgb2YgdGhlIHJvd3MgYmVmb3JlIGl0IChpLmUuIHJvdzAgYW5kIHJvdzEpLlxuICAgKlxuICAgKiBAcGFyYW0gcm93cyB0aGUgcm93IHRoYXQgbmVlZHMgdG8gYmUgcGxhY2VkIGluIHRoZSAyRCBzcGFjZS5cbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YVRhYmxlQm9keUNvbXBvbmVudFxuICAgKi9cbiAgZ2V0Um93c1N0eWxlcyhyb3dzOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHN0eWxlczogYW55ID0ge307XG5cbiAgICAvLyBvbmx5IGFkZCBzdHlsZXMgZm9yIHRoZSBncm91cCBpZiB0aGVyZSBpcyBhIGdyb3VwXG4gICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgIHN0eWxlcy53aWR0aCA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHMudG90YWw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICBsZXQgaWR4ID0gMDtcblxuICAgICAgaWYgKHRoaXMuZ3JvdXBlZFJvd3MpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBsYXRlc3Qgcm93IHJvd2luZGV4IGluIGEgZ3JvdXBcbiAgICAgICAgY29uc3Qgcm93ID0gcm93c1tyb3dzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZHggPSByb3cgPyB0aGlzLmdldFJvd0luZGV4KHJvdykgOiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWR4ID0gdGhpcy5nZXRSb3dJbmRleChyb3dzKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgcG9zID0gaWR4ICogcm93SGVpZ2h0O1xuICAgICAgLy8gVGhlIHBvc2l0aW9uIG9mIHRoaXMgcm93IHdvdWxkIGJlIHRoZSBzdW0gb2YgYWxsIHJvdyBoZWlnaHRzXG4gICAgICAvLyB1bnRpbCB0aGUgcHJldmlvdXMgcm93IHBvc2l0aW9uLlxuICAgICAgY29uc3QgcG9zID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUucXVlcnkoaWR4IC0gMSk7XG5cbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgMCwgcG9zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBib3R0b20gc3VtbWFyeSByb3cgb2Zmc2V0IGZvciBzY3JvbGxiYXIgbW9kZS5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgY2FjaGUgYW5kIG9mZnNldCBjYWxjdWxhdGlvblxuICAgKiBzZWUgZGVzY3JpcHRpb24gZm9yIGBnZXRSb3dzU3R5bGVzYCBtZXRob2RcbiAgICpcbiAgICogQHJldHVybnMgdGhlIENTUzMgc3R5bGUgdG8gYmUgYXBwbGllZFxuICAgKlxuICAgKiBAbWVtYmVyT2YgRGF0YVRhYmxlQm9keUNvbXBvbmVudFxuICAgKi9cbiAgZ2V0Qm90dG9tU3VtbWFyeVJvd1N0eWxlcygpOiBhbnkge1xuICAgIGlmICghdGhpcy5zY3JvbGxiYXJWIHx8ICF0aGlzLnJvd3MgfHwgIXRoaXMucm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlcyA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfTtcbiAgICBjb25zdCBwb3MgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh0aGlzLnJvd3MubGVuZ3RoIC0gMSk7XG5cbiAgICB0cmFuc2xhdGVYWShzdHlsZXMsIDAsIHBvcyk7XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBsb2FkaW5nIGluZGljYXRvclxuICAgKi9cbiAgaGlkZUluZGljYXRvcigpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLmxvYWRpbmdJbmRpY2F0b3IgPSBmYWxzZSksIDUwMCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgaW5kZXggb2YgdGhlIHJvd3MgaW4gdGhlIHZpZXdwb3J0XG4gICAqL1xuICB1cGRhdGVJbmRleGVzKCk6IHZvaWQge1xuICAgIGxldCBmaXJzdCA9IDA7XG4gICAgbGV0IGxhc3QgPSAwO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyVikge1xuICAgICAgaWYgKHRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRpb24gb2YgdGhlIGZpcnN0IGFuZCBsYXN0IGluZGV4ZXMgd2lsbCBiZSBiYXNlZCBvbiB3aGVyZSB0aGVcbiAgICAgICAgLy8gc2Nyb2xsWSBwb3NpdGlvbiB3b3VsZCBiZSBhdC4gIFRoZSBsYXN0IGluZGV4IHdvdWxkIGJlIHRoZSBvbmVcbiAgICAgICAgLy8gdGhhdCBzaG93cyB1cCBpbnNpZGUgdGhlIHZpZXcgcG9ydCB0aGUgbGFzdC5cbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gcGFyc2VJbnQodGhpcy5ib2R5SGVpZ2h0LCAwKTtcbiAgICAgICAgZmlyc3QgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5nZXRSb3dJbmRleCh0aGlzLm9mZnNldFkpO1xuICAgICAgICBsYXN0ID0gdGhpcy5yb3dIZWlnaHRzQ2FjaGUuZ2V0Um93SW5kZXgoaGVpZ2h0ICsgdGhpcy5vZmZzZXRZKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiB2aXJ0dWFsIHJvd3MgYXJlIG5vdCBuZWVkZWRcbiAgICAgICAgLy8gV2UgcmVuZGVyIGFsbCBpbiBvbmUgZ29cbiAgICAgICAgZmlyc3QgPSAwO1xuICAgICAgICBsYXN0ID0gdGhpcy5yb3dDb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHNlcnZlciBpcyBoYW5kbGluZyBwYWdpbmcgYW5kIHdpbGwgcGFzcyBhbiBhcnJheSB0aGF0IGJlZ2lucyB3aXRoIHRoZVxuICAgICAgLy8gZWxlbWVudCBhdCBhIHNwZWNpZmllZCBvZmZzZXQuICBmaXJzdCBzaG91bGQgYWx3YXlzIGJlIDAgd2l0aCBleHRlcm5hbCBwYWdpbmcuXG4gICAgICBpZiAoIXRoaXMuZXh0ZXJuYWxQYWdpbmcpIHtcbiAgICAgICAgZmlyc3QgPSBNYXRoLm1heCh0aGlzLm9mZnNldCAqIHRoaXMucGFnZVNpemUsIDApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IE1hdGgubWluKGZpcnN0ICsgdGhpcy5wYWdlU2l6ZSwgdGhpcy5yb3dDb3VudCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleGVzID0geyBmaXJzdCwgbGFzdCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZnJlc2hlcyB0aGUgZnVsbCBSb3cgSGVpZ2h0IGNhY2hlLiAgU2hvdWxkIGJlIHVzZWRcbiAgICogd2hlbiB0aGUgZW50aXJlIHJvdyBhcnJheSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHJlZnJlc2hSb3dIZWlnaHRDYWNoZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2Nyb2xsYmFyViB8fCAodGhpcy5zY3JvbGxiYXJWICYmICF0aGlzLnZpcnR1YWxpemF0aW9uKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNsZWFyIHRoZSBwcmV2aW91cyByb3cgaGVpZ2h0IGNhY2hlIGlmIGFscmVhZHkgcHJlc2VudC5cbiAgICAvLyB0aGlzIGlzIHVzZWZ1bCBkdXJpbmcgc29ydHMsIGZpbHRlcnMgd2hlcmUgdGhlIHN0YXRlIG9mIHRoZVxuICAgIC8vIHJvd3MgYXJyYXkgaXMgY2hhbmdlZC5cbiAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS5jbGVhckNhY2hlKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSB0cmVlIG9ubHkgaWYgdGhlcmUgYXJlIHJvd3MgaW5zaWRlIHRoZSB0cmVlLlxuICAgIGlmICh0aGlzLnJvd3MgJiYgdGhpcy5yb3dzLmxlbmd0aCkge1xuICAgICAgdGhpcy5yb3dIZWlnaHRzQ2FjaGUuaW5pdENhY2hlKHtcbiAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICBkZXRhaWxSb3dIZWlnaHQ6IHRoaXMuZ2V0RGV0YWlsUm93SGVpZ2h0LFxuICAgICAgICBleHRlcm5hbFZpcnR1YWw6IHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLmV4dGVybmFsUGFnaW5nLFxuICAgICAgICByb3dDb3VudDogdGhpcy5yb3dDb3VudCxcbiAgICAgICAgcm93SW5kZXhlczogdGhpcy5yb3dJbmRleGVzLFxuICAgICAgICByb3dFeHBhbnNpb25zOiB0aGlzLnJvd0V4cGFuc2lvbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbmRleCBmb3IgdGhlIHZpZXcgcG9ydFxuICAgKi9cbiAgZ2V0QWRqdXN0ZWRWaWV3UG9ydEluZGV4KCk6IG51bWJlciB7XG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cbiAgICAvLyBJZiB0aGUgc2Nyb2xsIGJhciBpcyBqdXN0IGJlbG93IHRoZSByb3cgd2hpY2ggaXMgaGlnaGxpZ2h0ZWQgdGhlbiBtYWtlIHRoYXQgYXMgdGhlXG4gICAgLy8gZmlyc3QgaW5kZXguXG4gICAgY29uc3Qgdmlld1BvcnRGaXJzdFJvd0luZGV4ID0gdGhpcy5pbmRleGVzLmZpcnN0O1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsYmFyViAmJiB0aGlzLnZpcnR1YWxpemF0aW9uKSB7XG4gICAgICBjb25zdCBvZmZzZXRTY3JvbGwgPSB0aGlzLnJvd0hlaWdodHNDYWNoZS5xdWVyeSh2aWV3UG9ydEZpcnN0Um93SW5kZXggLSAxKTtcbiAgICAgIHJldHVybiBvZmZzZXRTY3JvbGwgPD0gdGhpcy5vZmZzZXRZID8gdmlld1BvcnRGaXJzdFJvd0luZGV4IC0gMSA6IHZpZXdQb3J0Rmlyc3RSb3dJbmRleDtcbiAgICB9XG5cbiAgICByZXR1cm4gdmlld1BvcnRGaXJzdFJvd0luZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgRXhwYW5zaW9uIG9mIHRoZSByb3cgaS5lLiBpZiB0aGUgcm93IGlzIGV4cGFuZGVkIHRoZW4gaXQgd2lsbFxuICAgKiBjb2xsYXBzZSBhbmQgdmljZSB2ZXJzYS4gICBOb3RlIHRoYXQgdGhlIGV4cGFuZGVkIHN0YXR1cyBpcyBzdG9yZWQgYXNcbiAgICogYSBwYXJ0IG9mIHRoZSByb3cgb2JqZWN0IGl0c2VsZiBhcyB3ZSBoYXZlIHRvIHByZXNlcnZlIHRoZSBleHBhbmRlZCByb3dcbiAgICogc3RhdHVzIGluIGNhc2Ugb2Ygc29ydGluZyBhbmQgZmlsdGVyaW5nIG9mIHRoZSByb3cgc2V0LlxuICAgKi9cbiAgdG9nZ2xlUm93RXhwYW5zaW9uKHJvdzogYW55KTogdm9pZCB7XG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cbiAgICBjb25zdCB2aWV3UG9ydEZpcnN0Um93SW5kZXggPSB0aGlzLmdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpO1xuICAgIGxldCBleHBhbmRlZCA9IHRoaXMucm93RXhwYW5zaW9ucy5nZXQocm93KTtcblxuICAgIC8vIElmIHRoZSBkZXRhaWxSb3dIZWlnaHQgaXMgYXV0byAtLT4gb25seSBpbiBjYXNlIG9mIG5vbi12aXJ0dWFsaXplZCBzY3JvbGxcbiAgICBpZiAodGhpcy5zY3JvbGxiYXJWICYmIHRoaXMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgIGNvbnN0IGRldGFpbFJvd0hlaWdodCA9IHRoaXMuZ2V0RGV0YWlsUm93SGVpZ2h0KHJvdykgKiAoZXhwYW5kZWQgPyAtMSA6IDEpO1xuICAgICAgLy8gY29uc3QgaWR4ID0gdGhpcy5yb3dJbmRleGVzLmdldChyb3cpIHx8IDA7XG4gICAgICBjb25zdCBpZHggPSB0aGlzLmdldFJvd0luZGV4KHJvdyk7XG4gICAgICB0aGlzLnJvd0hlaWdodHNDYWNoZS51cGRhdGUoaWR4LCBkZXRhaWxSb3dIZWlnaHQpO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgdG9nZ2xlZCByb3cgYW5kIHVwZGF0ZSB0aGl2ZSBuZXZlcmUgaGVpZ2h0cyBpbiB0aGUgY2FjaGUuXG4gICAgZXhwYW5kZWQgPSBleHBhbmRlZCBePSAxO1xuICAgIHRoaXMucm93RXhwYW5zaW9ucy5zZXQocm93LCBleHBhbmRlZCk7XG5cbiAgICB0aGlzLmRldGFpbFRvZ2dsZS5lbWl0KHtcbiAgICAgIHJvd3M6IFtyb3ddLFxuICAgICAgY3VycmVudEluZGV4OiB2aWV3UG9ydEZpcnN0Um93SW5kZXhcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmQvQ29sbGFwc2UgYWxsIHRoZSByb3dzIG5vIG1hdHRlciB3aGF0IHRoZWlyIHN0YXRlIGlzLlxuICAgKi9cbiAgdG9nZ2xlQWxsUm93cyhleHBhbmRlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIGNsZWFyIHByZXYgZXhwYW5zaW9uc1xuICAgIHRoaXMucm93RXhwYW5zaW9ucy5jbGVhcigpO1xuXG4gICAgY29uc3Qgcm93RXhwYW5kZWQgPSBleHBhbmRlZCA/IDEgOiAwO1xuXG4gICAgLy8gQ2FwdHVyZSB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByb3cgdGhhdCBpcyB2aXNpYmxlIG9uIHRoZSB2aWV3cG9ydC5cbiAgICBjb25zdCB2aWV3UG9ydEZpcnN0Um93SW5kZXggPSB0aGlzLmdldEFkanVzdGVkVmlld1BvcnRJbmRleCgpO1xuXG4gICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5yb3dzKSB7XG4gICAgICB0aGlzLnJvd0V4cGFuc2lvbnMuc2V0KHJvdywgcm93RXhwYW5kZWQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNjcm9sbGJhclYpIHtcbiAgICAgIC8vIFJlZnJlc2ggdGhlIGZ1bGwgcm93IGhlaWdodHMgY2FjaGUgc2luY2UgZXZlcnkgcm93IHdhcyBhZmZlY3RlZC5cbiAgICAgIHRoaXMucmVjYWxjTGF5b3V0KCk7XG4gICAgfVxuXG4gICAgLy8gRW1pdCBhbGwgcm93cyB0aGF0IGhhdmUgYmVlbiBleHBhbmRlZC5cbiAgICB0aGlzLmRldGFpbFRvZ2dsZS5lbWl0KHtcbiAgICAgIHJvd3M6IHRoaXMucm93cyxcbiAgICAgIGN1cnJlbnRJbmRleDogdmlld1BvcnRGaXJzdFJvd0luZGV4XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSB0YWJsZVxuICAgKi9cbiAgcmVjYWxjTGF5b3V0KCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaFJvd0hlaWdodENhY2hlKCk7XG4gICAgdGhpcy51cGRhdGVJbmRleGVzKCk7XG4gICAgdGhpcy51cGRhdGVSb3dzKCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tzIHRoZSBjb2x1bW5cbiAgICovXG4gIGNvbHVtblRyYWNraW5nRm4oaW5kZXg6IG51bWJlciwgY29sdW1uOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBjb2x1bW4uJCRpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3cgcGlubmluZyBncm91cCBzdHlsZXNcbiAgICovXG4gIHN0eWxlc0J5R3JvdXAoZ3JvdXA6IHN0cmluZykge1xuICAgIGNvbnN0IHdpZHRocyA9IHRoaXMuY29sdW1uR3JvdXBXaWR0aHM7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHRoaXMub2Zmc2V0WDtcblxuICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgIHdpZHRoOiBgJHt3aWR0aHNbZ3JvdXBdfXB4YFxuICAgIH07XG5cbiAgICBpZiAoZ3JvdXAgPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXRYLCAwKTtcbiAgICB9IGVsc2UgaWYgKGdyb3VwID09PSAncmlnaHQnKSB7XG4gICAgICBjb25zdCBib2R5V2lkdGggPSBwYXJzZUludCh0aGlzLmlubmVyV2lkdGggKyAnJywgMCk7XG4gICAgICBjb25zdCB0b3RhbERpZmYgPSB3aWR0aHMudG90YWwgLSBib2R5V2lkdGg7XG4gICAgICBjb25zdCBvZmZzZXREaWZmID0gdG90YWxEaWZmIC0gb2Zmc2V0WDtcbiAgICAgIGNvbnN0IG9mZnNldCA9IG9mZnNldERpZmYgKiAtMTtcbiAgICAgIHRyYW5zbGF0ZVhZKHN0eWxlcywgb2Zmc2V0LCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3R5bGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaWYgdGhlIHJvdyB3YXMgZXhwYW5kZWQgYW5kIHNldCBkZWZhdWx0IHJvdyBleHBhbnNpb24gd2hlbiByb3cgZXhwYW5zaW9uIGlzIGVtcHR5XG4gICAqL1xuICBnZXRSb3dFeHBhbmRlZChyb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnJvd0V4cGFuc2lvbnMuc2l6ZSA9PT0gMCAmJiB0aGlzLmdyb3VwRXhwYW5zaW9uRGVmYXVsdCkge1xuICAgICAgZm9yIChjb25zdCBncm91cCBvZiB0aGlzLmdyb3VwZWRSb3dzKSB7XG4gICAgICAgIHRoaXMucm93RXhwYW5zaW9ucy5zZXQoZ3JvdXAsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGV4cGFuZGVkID0gdGhpcy5yb3dFeHBhbnNpb25zLmdldChyb3cpO1xuICAgIHJldHVybiBleHBhbmRlZCA9PT0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSByb3cgaW5kZXggZ2l2ZW4gYSByb3dcbiAgICovXG4gIGdldFJvd0luZGV4KHJvdzogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5yb3dJbmRleGVzLmdldChyb3cpIHx8IDA7XG4gIH1cblxuICBvblRyZWVBY3Rpb24ocm93OiBhbnkpIHtcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCh7IHJvdyB9KTtcbiAgfVxufVxuIl19
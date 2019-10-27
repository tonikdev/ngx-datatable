/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, HostBinding, ElementRef, Output, KeyValueDiffers, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, SkipSelf, } from '@angular/core';
import { columnsByPin, columnGroupWidths, columnsByPinArr } from '../../utils/column';
import { Keys } from '../../utils/keys';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { translateXY } from '../../utils/translate';
var DataTableBodyRowComponent = /** @class */ (function () {
    function DataTableBodyRowComponent(differs, scrollbarHelper, cd, element) {
        this.differs = differs;
        this.scrollbarHelper = scrollbarHelper;
        this.cd = cd;
        this.treeStatus = 'collapsed';
        this.rowInited = new EventEmitter();
        this.activate = new EventEmitter();
        this.treeAction = new EventEmitter();
        this._groupStyles = {
            left: {},
            center: {},
            right: {}
        };
        this._element = element.nativeElement;
        this._rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columns", {
        get: /**
         * @return {?}
         */
        function () {
            return this._columns;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._columns = val;
            this.recalculateColumns(val);
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "innerWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this._innerWidth;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            if (this._columns) {
                /** @type {?} */
                var colByPin = columnsByPin(this._columns);
                this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
            }
            this._innerWidth = val;
            this.recalculateColumns();
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "offsetX", {
        get: /**
         * @return {?}
         */
        function () {
            return this._offsetX;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._offsetX = val;
            this.buildStylesByGroup();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "cssClass", {
        get: /**
         * @return {?}
         */
        function () {
            var e_1, _a;
            /** @type {?} */
            var cls = 'datatable-body-row';
            if (this.isSelected) {
                cls += ' active';
            }
            if (this.rowIndex % 2 !== 0) {
                cls += ' datatable-row-odd';
            }
            if (this.rowIndex % 2 === 0) {
                cls += ' datatable-row-even';
            }
            if (this.rowClass) {
                /** @type {?} */
                var res = this.rowClass(this.row);
                if (typeof res === 'string') {
                    cls += " " + res;
                }
                else if (typeof res === 'object') {
                    /** @type {?} */
                    var keys = Object.keys(res);
                    try {
                        for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                            var k = keys_1_1.value;
                            if (res[k] === true) {
                                cls += " " + k;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableBodyRowComponent.prototype, "columnsTotalWidths", {
        get: /**
         * @return {?}
         */
        function () {
            return this._columnGroupWidths.total;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this._rowDiffer.diff(this.row)) {
            this.cd.markForCheck();
        }
    };
    /**
     * @param {?} index
     * @param {?} colGroup
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.trackByGroups = /**
     * @param {?} index
     * @param {?} colGroup
     * @return {?}
     */
    function (index, colGroup) {
        return colGroup.type;
    };
    /**
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.columnTrackingFn = /**
     * @param {?} index
     * @param {?} column
     * @return {?}
     */
    function (index, column) {
        return column.$$id;
    };
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.buildStylesByGroup = /**
     * @return {?}
     */
    function () {
        this._groupStyles.left = this.calcStylesByGroup('left');
        this._groupStyles.center = this.calcStylesByGroup('center');
        this._groupStyles.right = this.calcStylesByGroup('right');
        this.cd.markForCheck();
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.calcStylesByGroup = /**
     * @param {?} group
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var widths = this._columnGroupWidths;
        /** @type {?} */
        var offsetX = this.offsetX;
        /** @type {?} */
        var styles = {
            width: widths[group] + "px"
        };
        if (group === 'left') {
            translateXY(styles, offsetX, 0);
        }
        else if (group === 'right') {
            /** @type {?} */
            var bodyWidth = parseInt(this.innerWidth + '', 0);
            /** @type {?} */
            var totalDiff = widths.total - bodyWidth;
            /** @type {?} */
            var offsetDiff = totalDiff - offsetX;
            /** @type {?} */
            var offset = (offsetDiff + this.scrollbarHelper.width) * -1;
            translateXY(styles, offset, 0);
        }
        return styles;
    };
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onActivate = /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    function (event, index) {
        event.cellIndex = index;
        event.rowElement = this._element;
        this.activate.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var keyCode = event.keyCode;
        /** @type {?} */
        var isTargetRow = event.target === this._element;
        /** @type {?} */
        var isAction = keyCode === Keys.return ||
            keyCode === Keys.down ||
            keyCode === Keys.up ||
            keyCode === Keys.left ||
            keyCode === Keys.right;
        if (isAction && isTargetRow) {
            event.preventDefault();
            event.stopPropagation();
            this.activate.emit({
                type: 'keydown',
                event: event,
                row: this.row,
                rowElement: this._element
            });
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onMouseenter = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.activate.emit({
            type: 'mouseenter',
            event: event,
            row: this.row,
            rowElement: this._element
        });
    };
    /**
     * @param {?=} val
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.recalculateColumns = /**
     * @param {?=} val
     * @return {?}
     */
    function (val) {
        if (val === void 0) { val = this.columns; }
        this._columns = val;
        /** @type {?} */
        var colsByPin = columnsByPin(this._columns);
        this._columnsByPin = columnsByPinArr(this._columns);
        this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
    };
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.onTreeAction = /**
     * @return {?}
     */
    function () {
        this.treeAction.emit();
    };
    /**
     * @return {?}
     */
    DataTableBodyRowComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.rowInited.emit({
            type: 'rowInited',
            row: this.row,
            rowElement: this._element
        });
    };
    DataTableBodyRowComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datatable-body-row',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <div\n      *ngFor=\"let colGroup of _columnsByPin; let i = index; trackBy: trackByGroups\"\n      class=\"datatable-row-{{ colGroup.type }} datatable-row-group\"\n      [ngStyle]=\"_groupStyles[colGroup.type]\"\n    >\n      <datatable-body-cell\n        *ngFor=\"let column of colGroup.columns; let ii = index; trackBy: columnTrackingFn\"\n        tabindex=\"-1\"\n        [row]=\"row\"\n        [group]=\"group\"\n        [expanded]=\"expanded\"\n        [isSelected]=\"isSelected\"\n        [rowIndex]=\"rowIndex\"\n        [column]=\"column\"\n        [rowHeight]=\"rowHeight\"\n        [displayCheck]=\"displayCheck\"\n        [treeStatus]=\"treeStatus\"\n        (activate)=\"onActivate($event, ii)\"\n        (treeAction)=\"onTreeAction()\"\n      >\n      </datatable-body-cell>\n    </div>\n  "
                }] }
    ];
    /** @nocollapse */
    DataTableBodyRowComponent.ctorParameters = function () { return [
        { type: KeyValueDiffers },
        { type: ScrollbarHelper, decorators: [{ type: SkipSelf }] },
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    DataTableBodyRowComponent.propDecorators = {
        columns: [{ type: Input }],
        innerWidth: [{ type: Input }],
        expanded: [{ type: Input }],
        rowClass: [{ type: Input }],
        row: [{ type: Input }],
        group: [{ type: Input }],
        isSelected: [{ type: Input }],
        rowIndex: [{ type: Input }],
        displayCheck: [{ type: Input }],
        treeStatus: [{ type: Input }],
        offsetX: [{ type: Input }],
        cssClass: [{ type: HostBinding, args: ['class',] }],
        rowHeight: [{ type: HostBinding, args: ['style.height.px',] }, { type: Input }],
        columnsTotalWidths: [{ type: HostBinding, args: ['style.width.px',] }],
        rowInited: [{ type: Output }],
        activate: [{ type: Output }],
        treeAction: [{ type: Output }],
        onKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
        onMouseenter: [{ type: HostListener, args: ['mouseenter', ['$event'],] }]
    };
    return DataTableBodyRowComponent;
}());
export { DataTableBodyRowComponent };
if (false) {
    /** @type {?} */
    DataTableBodyRowComponent.prototype.expanded;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowClass;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.row;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.group;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.isSelected;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowIndex;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.displayCheck;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.treeStatus;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowHeight;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.rowInited;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.activate;
    /** @type {?} */
    DataTableBodyRowComponent.prototype.treeAction;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._element;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columnGroupWidths;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columnsByPin;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._offsetX;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._columns;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._innerWidth;
    /** @type {?} */
    DataTableBodyRowComponent.prototype._groupStyles;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype._rowDiffer;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.differs;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.scrollbarHelper;
    /**
     * @type {?}
     * @private
     */
    DataTableBodyRowComponent.prototype.cd;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1kYXRhdGFibGUvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ib2R5L2JvZHktcm93LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFdBQVcsRUFDWCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGVBQWUsRUFFZixZQUFZLEVBQ1osWUFBWSxFQUNaLHVCQUF1QixFQUN2QixpQkFBaUIsRUFFakIsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFcEQ7SUFpSUUsbUNBQ1UsT0FBd0IsRUFDWixlQUFnQyxFQUM1QyxFQUFxQixFQUM3QixPQUFtQjtRQUhYLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ1osb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQzVDLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBdkV0QixlQUFVLEdBQWUsV0FBVyxDQUFDO1FBa0RwQyxjQUFTLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDbEQsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVE3RCxpQkFBWSxHQUEyQjtZQUNyQyxJQUFJLEVBQUUsRUFBRTtZQUNSLE1BQU0sRUFBRSxFQUFFO1lBQ1YsS0FBSyxFQUFFLEVBQUU7U0FDVixDQUFDO1FBVUEsSUFBSSxDQUFDLFFBQVEs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QkFjUixlQUFlLHVCQXNJbkIsUUFBUTtnQkEvSVgsaUJBQWlCO2dCQVBqQixVQUFVOzs7MEJBZ0RULEtBQUs7NkJBVUwsS0FBSzsyQkFlTCxLQUFLOzJCQUNMLEtBQUs7c0JBQ0wsS0FBSzt3QkFDTCxLQUFLOzZCQUNMLEtBQUs7MkJBQ0wsS0FBSzsrQkFDTCxLQUFLOzZCQUNMLEtBQUs7MEJBRUwsS0FBSzsyQkFTTCxXQUFXLFNBQUMsT0FBTzs0QkE4Qm5CLFdBQVcsU0FBQyxpQkFBaUIsY0FDN0IsS0FBSztxQ0FHTCxXQUFXLFNBQUMsZ0JBQWdCOzRCQUs1QixNQUFNOzJCQUNOLE1BQU07NkJBQ04sTUFBTTs0QkEwRU4sWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzsrQkF5QmxDLFlBQVksU0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBNEJ4QyxnQ0FBQztDQUFBLEFBaFBELElBZ1BDO1NBcE5ZLHlCQUF5Qjs7O0lBMEJwQyw2Q0FBMkI7O0lBQzNCLDZDQUF1Qjs7SUFDdkIsd0NBQWtCOztJQUNsQiwwQ0FBb0I7O0lBQ3BCLCtDQUE2Qjs7SUFDN0IsNkNBQTBCOztJQUMxQixpREFBMkI7O0lBQzNCLCtDQUE4Qzs7SUF5QzlDLDhDQUVrQjs7SUFPbEIsOENBQTREOztJQUM1RCw2Q0FBMkQ7O0lBQzNELCtDQUE2RDs7SUFFN0QsNkNBQWM7O0lBQ2QsdURBQXdCOztJQUN4QixrREFBbUI7O0lBQ25CLDZDQUFpQjs7SUFDakIsNkNBQWdCOztJQUNoQixnREFBb0I7O0lBQ3BCLGlEQUlFOzs7OztJQUVGLCtDQUEyQzs7Ozs7SUFHekMsNENBQWdDOzs7OztJQUNoQyxvREFBb0Q7Ozs7O0lBQ3BELHVDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIEhvc3RCaW5kaW5nLFxuICBFbGVtZW50UmVmLFxuICBPdXRwdXQsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgS2V5VmFsdWVEaWZmZXIsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERvQ2hlY2ssXG4gIFNraXBTZWxmLFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBUcmVlU3RhdHVzIH0gZnJvbSAnLi9ib2R5LWNlbGwuY29tcG9uZW50JztcbmltcG9ydCB7IGNvbHVtbnNCeVBpbiwgY29sdW1uR3JvdXBXaWR0aHMsIGNvbHVtbnNCeVBpbkFyciB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbHVtbic7XG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMva2V5cyc7XG5pbXBvcnQgeyBTY3JvbGxiYXJIZWxwZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zY3JvbGxiYXItaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgdHJhbnNsYXRlWFkgfSBmcm9tICcuLi8uLi91dGlscy90cmFuc2xhdGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtYm9keS1yb3cnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICAqbmdGb3I9XCJsZXQgY29sR3JvdXAgb2YgX2NvbHVtbnNCeVBpbjsgbGV0IGkgPSBpbmRleDsgdHJhY2tCeTogdHJhY2tCeUdyb3Vwc1wiXG4gICAgICBjbGFzcz1cImRhdGF0YWJsZS1yb3cte3sgY29sR3JvdXAudHlwZSB9fSBkYXRhdGFibGUtcm93LWdyb3VwXCJcbiAgICAgIFtuZ1N0eWxlXT1cIl9ncm91cFN0eWxlc1tjb2xHcm91cC50eXBlXVwiXG4gICAgPlxuICAgICAgPGRhdGF0YWJsZS1ib2R5LWNlbGxcbiAgICAgICAgKm5nRm9yPVwibGV0IGNvbHVtbiBvZiBjb2xHcm91cC5jb2x1bW5zOyBsZXQgaWkgPSBpbmRleDsgdHJhY2tCeTogY29sdW1uVHJhY2tpbmdGblwiXG4gICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICBbcm93XT1cInJvd1wiXG4gICAgICAgIFtncm91cF09XCJncm91cFwiXG4gICAgICAgIFtleHBhbmRlZF09XCJleHBhbmRlZFwiXG4gICAgICAgIFtpc1NlbGVjdGVkXT1cImlzU2VsZWN0ZWRcIlxuICAgICAgICBbcm93SW5kZXhdPVwicm93SW5kZXhcIlxuICAgICAgICBbY29sdW1uXT1cImNvbHVtblwiXG4gICAgICAgIFtyb3dIZWlnaHRdPVwicm93SGVpZ2h0XCJcbiAgICAgICAgW2Rpc3BsYXlDaGVja109XCJkaXNwbGF5Q2hlY2tcIlxuICAgICAgICBbdHJlZVN0YXR1c109XCJ0cmVlU3RhdHVzXCJcbiAgICAgICAgKGFjdGl2YXRlKT1cIm9uQWN0aXZhdGUoJGV2ZW50LCBpaSlcIlxuICAgICAgICAodHJlZUFjdGlvbik9XCJvblRyZWVBY3Rpb24oKVwiXG4gICAgICA+XG4gICAgICA8L2RhdGF0YWJsZS1ib2R5LWNlbGw+XG4gICAgPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgRGF0YVRhYmxlQm9keVJvd0NvbXBvbmVudCBpbXBsZW1lbnRzIERvQ2hlY2ssIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHNldCBjb2x1bW5zKHZhbDogYW55W10pIHtcbiAgICB0aGlzLl9jb2x1bW5zID0gdmFsO1xuICAgIHRoaXMucmVjYWxjdWxhdGVDb2x1bW5zKHZhbCk7XG4gICAgdGhpcy5idWlsZFN0eWxlc0J5R3JvdXAoKTtcbiAgfVxuXG4gIGdldCBjb2x1bW5zKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBpbm5lcldpZHRoKHZhbDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX2NvbHVtbnMpIHtcbiAgICAgIGNvbnN0IGNvbEJ5UGluID0gY29sdW1uc0J5UGluKHRoaXMuX2NvbHVtbnMpO1xuICAgICAgdGhpcy5fY29sdW1uR3JvdXBXaWR0aHMgPSBjb2x1bW5Hcm91cFdpZHRocyhjb2xCeVBpbiwgdGhpcy5fY29sdW1ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5faW5uZXJXaWR0aCA9IHZhbDtcbiAgICB0aGlzLnJlY2FsY3VsYXRlQ29sdW1ucygpO1xuICAgIHRoaXMuYnVpbGRTdHlsZXNCeUdyb3VwKCk7XG4gIH1cblxuICBnZXQgaW5uZXJXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pbm5lcldpZHRoO1xuICB9XG5cbiAgQElucHV0KCkgZXhwYW5kZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJvd0NsYXNzOiBhbnk7XG4gIEBJbnB1dCgpIHJvdzogYW55O1xuICBASW5wdXQoKSBncm91cDogYW55O1xuICBASW5wdXQoKSBpc1NlbGVjdGVkOiBib29sZWFuO1xuICBASW5wdXQoKSByb3dJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBkaXNwbGF5Q2hlY2s6IGFueTtcbiAgQElucHV0KCkgdHJlZVN0YXR1czogVHJlZVN0YXR1cyA9ICdjb2xsYXBzZWQnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvZmZzZXRYKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fb2Zmc2V0WCA9IHZhbDtcbiAgICB0aGlzLmJ1aWxkU3R5bGVzQnlHcm91cCgpO1xuICB9XG4gIGdldCBvZmZzZXRYKCkge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXRYO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBjc3NDbGFzcygpIHtcbiAgICBsZXQgY2xzID0gJ2RhdGF0YWJsZS1ib2R5LXJvdyc7XG4gICAgaWYgKHRoaXMuaXNTZWxlY3RlZCkge1xuICAgICAgY2xzICs9ICcgYWN0aXZlJztcbiAgICB9XG4gICAgaWYgKHRoaXMucm93SW5kZXggJSAyICE9PSAwKSB7XG4gICAgICBjbHMgKz0gJyBkYXRhdGFibGUtcm93LW9kZCc7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvd0luZGV4ICUgMiA9PT0gMCkge1xuICAgICAgY2xzICs9ICcgZGF0YXRhYmxlLXJvdy1ldmVuJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yb3dDbGFzcykge1xuICAgICAgY29uc3QgcmVzID0gdGhpcy5yb3dDbGFzcyh0aGlzLnJvdyk7XG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY2xzICs9IGAgJHtyZXN9YDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJlcyk7XG4gICAgICAgIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgICAgICAgaWYgKHJlc1trXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2xzICs9IGAgJHtrfWA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNscztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0LnB4JylcbiAgQElucHV0KClcbiAgcm93SGVpZ2h0OiBudW1iZXI7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aC5weCcpXG4gIGdldCBjb2x1bW5zVG90YWxXaWR0aHMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uR3JvdXBXaWR0aHMudG90YWw7XG4gIH1cblxuICBAT3V0cHV0KCkgcm93SW5pdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHRyZWVBY3Rpb246IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIF9lbGVtZW50OiBhbnk7XG4gIF9jb2x1bW5Hcm91cFdpZHRoczogYW55O1xuICBfY29sdW1uc0J5UGluOiBhbnk7XG4gIF9vZmZzZXRYOiBudW1iZXI7XG4gIF9jb2x1bW5zOiBhbnlbXTtcbiAgX2lubmVyV2lkdGg6IG51bWJlcjtcbiAgX2dyb3VwU3R5bGVzOiB7IFtwcm9wOiBzdHJpbmddOiB7fSB9ID0ge1xuICAgIGxlZnQ6IHt9LFxuICAgIGNlbnRlcjoge30sXG4gICAgcmlnaHQ6IHt9XG4gIH07XG5cbiAgcHJpdmF0ZSBfcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuICAgIEBTa2lwU2VsZigpIHByaXZhdGUgc2Nyb2xsYmFySGVscGVyOiBTY3JvbGxiYXJIZWxwZXIsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZWxlbWVudDogRWxlbWVudFJlZlxuICApIHtcbiAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX3Jvd0RpZmZlciA9IGRpZmZlcnMuZmluZCh7fSkuY3JlYXRlKCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3Jvd0RpZmZlci5kaWZmKHRoaXMucm93KSkge1xuICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICB0cmFja0J5R3JvdXBzKGluZGV4OiBudW1iZXIsIGNvbEdyb3VwOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBjb2xHcm91cC50eXBlO1xuICB9XG5cbiAgY29sdW1uVHJhY2tpbmdGbihpbmRleDogbnVtYmVyLCBjb2x1bW46IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGNvbHVtbi4kJGlkO1xuICB9XG5cbiAgYnVpbGRTdHlsZXNCeUdyb3VwKCkge1xuICAgIHRoaXMuX2dyb3VwU3R5bGVzLmxlZnQgPSB0aGlzLmNhbGNTdHlsZXNCeUdyb3VwKCdsZWZ0Jyk7XG4gICAgdGhpcy5fZ3JvdXBTdHlsZXMuY2VudGVyID0gdGhpcy5jYWxjU3R5bGVzQnlHcm91cCgnY2VudGVyJyk7XG4gICAgdGhpcy5fZ3JvdXBTdHlsZXMucmlnaHQgPSB0aGlzLmNhbGNTdHlsZXNCeUdyb3VwKCdyaWdodCcpO1xuICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBjYWxjU3R5bGVzQnlHcm91cChncm91cDogc3RyaW5nKSB7XG4gICAgY29uc3Qgd2lkdGhzID0gdGhpcy5fY29sdW1uR3JvdXBXaWR0aHM7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHRoaXMub2Zmc2V0WDtcblxuICAgIGNvbnN0IHN0eWxlcyA9IHtcbiAgICAgIHdpZHRoOiBgJHt3aWR0aHNbZ3JvdXBdfXB4YFxuICAgIH07XG5cbiAgICBpZiAoZ3JvdXAgPT09ICdsZWZ0Jykge1xuICAgICAgdHJhbnNsYXRlWFkoc3R5bGVzLCBvZmZzZXRYLCAwKTtcbiAgICB9IGVsc2UgaWYgKGdyb3VwID09PSAncmlnaHQnKSB7XG4gICAgICBjb25zdCBib2R5V2lkdGggPSBwYXJzZUludCh0aGlzLmlubmVyV2lkdGggKyAnJywgMCk7XG4gICAgICBjb25zdCB0b3RhbERpZmYgPSB3aWR0aHMudG90YWwgLSBib2R5V2lkdGg7XG4gICAgICBjb25zdCBvZmZzZXREaWZmID0gdG90YWxEaWZmIC0gb2Zmc2V0WDtcbiAgICAgIGNvbnN0IG9mZnNldCA9IChvZmZzZXREaWZmICsgdGhpcy5zY3JvbGxiYXJIZWxwZXIud2lkdGgpICogLTE7XG4gICAgICB0cmFuc2xhdGVYWShzdHlsZXMsIG9mZnNldCwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxuXG4gIG9uQWN0aXZhdGUoZXZlbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGV2ZW50LmNlbGxJbmRleCA9IGluZGV4O1xuICAgIGV2ZW50LnJvd0VsZW1lbnQgPSB0aGlzLl9lbGVtZW50O1xuICAgIHRoaXMuYWN0aXZhdGUuZW1pdChldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaXNUYXJnZXRSb3cgPSBldmVudC50YXJnZXQgPT09IHRoaXMuX2VsZW1lbnQ7XG5cbiAgICBjb25zdCBpc0FjdGlvbiA9XG4gICAgICBrZXlDb2RlID09PSBLZXlzLnJldHVybiB8fFxuICAgICAga2V5Q29kZSA9PT0gS2V5cy5kb3duIHx8XG4gICAgICBrZXlDb2RlID09PSBLZXlzLnVwIHx8XG4gICAgICBrZXlDb2RlID09PSBLZXlzLmxlZnQgfHxcbiAgICAgIGtleUNvZGUgPT09IEtleXMucmlnaHQ7XG5cbiAgICBpZiAoaXNBY3Rpb24gJiYgaXNUYXJnZXRSb3cpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHtcbiAgICAgICAgdHlwZTogJ2tleWRvd24nLFxuICAgICAgICBldmVudCxcbiAgICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgICAgcm93RWxlbWVudDogdGhpcy5fZWxlbWVudFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VlbnRlcihldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmF0ZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdtb3VzZWVudGVyJyxcbiAgICAgIGV2ZW50LFxuICAgICAgcm93OiB0aGlzLnJvdyxcbiAgICAgIHJvd0VsZW1lbnQ6IHRoaXMuX2VsZW1lbnRcbiAgICB9KTtcbiAgfVxuXG4gIHJlY2FsY3VsYXRlQ29sdW1ucyh2YWw6IGFueVtdID0gdGhpcy5jb2x1bW5zKTogdm9pZCB7XG4gICAgdGhpcy5fY29sdW1ucyA9IHZhbDtcbiAgICBjb25zdCBjb2xzQnlQaW4gPSBjb2x1bW5zQnlQaW4odGhpcy5fY29sdW1ucyk7XG4gICAgdGhpcy5fY29sdW1uc0J5UGluID0gY29sdW1uc0J5UGluQXJyKHRoaXMuX2NvbHVtbnMpO1xuICAgIHRoaXMuX2NvbHVtbkdyb3VwV2lkdGhzID0gY29sdW1uR3JvdXBXaWR0aHMoY29sc0J5UGluLCB0aGlzLl9jb2x1bW5zKTtcbiAgfVxuXG4gIG9uVHJlZUFjdGlvbigpIHtcbiAgICB0aGlzLnRyZWVBY3Rpb24uZW1pdCgpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yb3dJbml0ZWQuZW1pdCh7XG4gICAgICB0eXBlOiAncm93SW5pdGVkJyxcbiAgICAgIHJvdzogdGhpcy5yb3csXG4gICAgICByb3dFbGVtZW50OiB0aGlzLl9lbGVtZW50XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, KeyValueDiffers } from '@angular/core';
import { MouseEvent } from '../../events';
var DataTableRowWrapperComponent = /** @class */ (function () {
    function DataTableRowWrapperComponent(cd, differs) {
        this.cd = cd;
        this.differs = differs;
        this.rowContextmenu = new EventEmitter(false);
        this.rowInited = new EventEmitter(false);
        this.groupContext = {
            group: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this.rowContext = {
            row: this.row,
            expanded: this.expanded,
            rowIndex: this.rowIndex
        };
        this._expanded = false;
        this.rowDiffer = differs.find({}).create();
    }
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "rowIndex", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rowIndex;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._rowIndex = val;
            this.rowContext.rowIndex = val;
            this.groupContext.rowIndex = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataTableRowWrapperComponent.prototype, "expanded", {
        get: /**
         * @return {?}
         */
        function () {
            return this._expanded;
        },
        set: /**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            this._expanded = val;
            this.groupContext.expanded = val;
            this.rowContext.expanded = val;
            this.cd.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.onContextmenu = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    };
    /**
     * @return {?}
     */
    DataTableRowWrapperComponent.prototype.getGroupHeaderStyle = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    };
    DataTableRowWrapperComponent.decorators = [
        { type: Component, args: [{
                    selector: 'datatable-row-wrapper',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n    <div *ngIf=\"groupHeader && groupHeader.template\" class=\"datatable-group-header\" [ngStyle]=\"getGroupHeaderStyle()\">\n      <ng-template\n        *ngIf=\"groupHeader && groupHeader.template\"\n        [ngTemplateOutlet]=\"groupHeader.template\"\n        [ngTemplateOutletContext]=\"groupContext\"\n      >\n      </ng-template>\n    </div>\n    <ng-content *ngIf=\"(groupHeader && groupHeader.template && expanded) || (!groupHeader || !groupHeader.template)\">\n    </ng-content>\n    <div\n      *ngIf=\"rowDetail && rowDetail.template && expanded\"\n      [style.height.px]=\"detailRowHeight\"\n      class=\"datatable-row-detail\"\n    >\n      <ng-template\n        *ngIf=\"rowDetail && rowDetail.template\"\n        [ngTemplateOutlet]=\"rowDetail.template\"\n        [ngTemplateOutletContext]=\"rowContext\"\n      >\n      </ng-template>\n    </div>\n  ",
                    host: {
                        class: 'datatable-row-wrapper'
                    }
                }] }
    ];
    /** @nocollapse */
    DataTableRowWrapperComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: KeyValueDiffers }
    ]; };
    DataTableRowWrapperComponent.propDecorators = {
        innerWidth: [{ type: Input }],
        rowDetail: [{ type: Input }],
        groupHeader: [{ type: Input }],
        offsetX: [{ type: Input }],
        detailRowHeight: [{ type: Input }],
        row: [{ type: Input }],
        groupedRows: [{ type: Input }],
        rowContextmenu: [{ type: Output }],
        rowInited: [{ type: Output }],
        rowIndex: [{ type: Input }],
        expanded: [{ type: Input }],
        onContextmenu: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
    };
    return DataTableRowWrapperComponent;
}());
export { DataTableRowWrapperComponent };
if (false) {
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.innerWidth;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowDetail;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupHeader;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.offsetX;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.detailRowHeight;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.row;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupedRows;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowContextmenu;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowInited;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.groupContext;
    /** @type {?} */
    DataTableRowWrapperComponent.prototype.rowContext;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.rowDiffer;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype._expanded;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype._rowIndex;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.cd;
    /**
     * @type {?}
     * @private
     */
    DataTableRowWrapperComponent.prototype.differs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUVaLHVCQUF1QixFQUV2QixpQkFBaUIsRUFDakIsZUFBZSxFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDO0lBZ0ZFLHNDQUFvQixFQUFxQixFQUFVLE9BQXdCO1FBQXZELE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUF6Q2pFLG1CQUFjLEdBQUcsSUFBSSxZQUFZLENBQWtDLEtBQUssQ0FBQyxDQUFDO1FBQzFFLGNBQVMsR0FBRyxJQUFJLFlBQVksQ0FBaUIsS0FBSyxDQUFDLENBQUM7UUF3QjlELGlCQUFZLEdBQVE7WUFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2YsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO1FBRUYsZUFBVSxHQUFRO1lBQ2hCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQztRQUdNLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFJakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzdDLENBQUM7SUF4Q0Qsc0JBQWEsa0RBQVE7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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIERvQ2hlY2ssXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBLZXlWYWx1ZURpZmZlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEtleVZhbHVlRGlmZmVyc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vdXNlRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtcm93LXdyYXBwZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwiZ3JvdXBIZWFkZXIgJiYgZ3JvdXBIZWFkZXIudGVtcGxhdGVcIiBjbGFzcz1cImRhdGF0YWJsZS1ncm91cC1oZWFkZXJcIiBbbmdTdHlsZV09XCJnZXRHcm91cEhlYWRlclN0eWxlKClcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAqbmdJZj1cImdyb3VwSGVhZGVyICYmIGdyb3VwSGVhZGVyLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZ3JvdXBIZWFkZXIudGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZ3JvdXBDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgKm5nSWY9XCIoZ3JvdXBIZWFkZXIgJiYgZ3JvdXBIZWFkZXIudGVtcGxhdGUgJiYgZXhwYW5kZWQpIHx8ICghZ3JvdXBIZWFkZXIgfHwgIWdyb3VwSGVhZGVyLnRlbXBsYXRlKVwiPlxuICAgIDwvbmctY29udGVudD5cbiAgICA8ZGl2XG4gICAgICAqbmdJZj1cInJvd0RldGFpbCAmJiByb3dEZXRhaWwudGVtcGxhdGUgJiYgZXhwYW5kZWRcIlxuICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJkZXRhaWxSb3dIZWlnaHRcIlxuICAgICAgY2xhc3M9XCJkYXRhdGFibGUtcm93LWRldGFpbFwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwicm93RGV0YWlsICYmIHJvd0RldGFpbC50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInJvd0RldGFpbC50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJyb3dDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2RhdGF0YWJsZS1yb3ctd3JhcHBlcidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVSb3dXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjayB7XG4gIEBJbnB1dCgpIGlubmVyV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgcm93RGV0YWlsOiBhbnk7XG4gIEBJbnB1dCgpIGdyb3VwSGVhZGVyOiBhbnk7XG4gIEBJbnB1dCgpIG9mZnNldFg6IG51bWJlcjtcbiAgQElucHV0KCkgZGV0YWlsUm93SGVpZ2h0OiBhbnk7XG4gIEBJbnB1dCgpIHJvdzogYW55O1xuICBASW5wdXQoKSBncm91cGVkUm93czogYW55O1xuICBAT3V0cHV0KCkgcm93Q29udGV4dG1lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQ7IHJvdzogYW55IH0+KGZhbHNlKTtcbiAgQE91dHB1dCgpIHJvd0luaXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogYW55IH0+KGZhbHNlKTtcblxuICBASW5wdXQoKSBzZXQgcm93SW5kZXgodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3dJbmRleCA9IHZhbDtcbiAgICB0aGlzLnJvd0NvbnRleHQucm93SW5kZXggPSB2YWw7XG4gICAgdGhpcy5ncm91cENvbnRleHQucm93SW5kZXggPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCByb3dJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3dJbmRleDtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBleHBhbmRlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLmdyb3VwQ29udGV4dC5leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLnJvd0NvbnRleHQuZXhwYW5kZWQgPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XG4gIH1cblxuICBncm91cENvbnRleHQ6IGFueSA9IHtcbiAgICBncm91cDogdGhpcy5yb3csXG4gICAgZXhwYW5kZWQ6IHRoaXMuZXhwYW5kZWQsXG4gICAgcm93SW5kZXg6IHRoaXMucm93SW5kZXhcbiAgfTtcblxuICByb3dDb250ZXh0OiBhbnkgPSB7XG4gICAgcm93OiB0aGlzLnJvdyxcbiAgICBleHBhbmRlZDogdGhpcy5leHBhbmRlZCxcbiAgICByb3dJbmRleDogdGhpcy5yb3dJbmRleFxuICB9O1xuXG4gIHByaXZhdGUgcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xuICBwcml2YXRlIF9leHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9yb3dJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycykge1xuICAgIHRoaXMucm93RGlmZmVyID0gZGlmZmVycy5maW5kKHt9KS5jcmVhdGUoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3dEaWZmZXIuZGlmZih0aGlzLnJvdykpIHtcbiAgICAgIHRoaXMucm93Q29udGV4dC5yb3cgPSB0aGlzLnJvdztcbiAgICAgIHRoaXMuZ3JvdXBDb250ZXh0Lmdyb3VwID0gdGhpcy5yb3c7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcbiAgb25Db250ZXh0bWVudSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnJvd0NvbnRleHRtZW51LmVtaXQoeyBldmVudDogJGV2ZW50LCByb3c6IHRoaXMucm93IH0pO1xuICB9XG5cbiAgZ2V0R3JvdXBIZWFkZXJTdHlsZSgpOiBhbnkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHt9O1xuXG4gICAgc3R5bGVzWyd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUzZCgnICsgdGhpcy5vZmZzZXRYICsgJ3B4LCAwcHgsIDBweCknO1xuICAgIHN0eWxlc1snYmFja2ZhY2UtdmlzaWJpbGl0eSddID0gJ2hpZGRlbic7XG4gICAgc3R5bGVzWyd3aWR0aCddID0gdGhpcy5pbm5lcldpZHRoO1xuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxufVxuIl19
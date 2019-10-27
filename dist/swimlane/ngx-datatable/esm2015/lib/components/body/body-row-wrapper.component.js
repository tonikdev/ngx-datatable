/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, KeyValueDiffers } from '@angular/core';
import { MouseEvent } from '../../events';
export class DataTableRowWrapperComponent {
    /**
     * @param {?} cd
     * @param {?} differs
     */
    constructor(cd, differs) {
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
    /**
     * @param {?} val
     * @return {?}
     */
    set rowIndex(val) {
        this._rowIndex = val;
        this.rowContext.rowIndex = val;
        this.groupContext.rowIndex = val;
        this.cd.markForCheck();
    }
    /**
     * @return {?}
     */
    get rowIndex() {
        return this._rowIndex;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set expanded(val) {
        this._expanded = val;
        this.groupContext.expanded = val;
        this.rowContext.expanded = val;
        this.cd.markForCheck();
    }
    /**
     * @return {?}
     */
    get expanded() {
        return this._expanded;
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.rowDiffer.diff(this.row)) {
            this.rowContext.row = this.row;
            this.groupContext.group = this.row;
            this.cd.markForCheck();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onContextmenu($event) {
        this.rowContextmenu.emit({ event: $event, row: this.row });
    }
    /**
     * @return {?}
     */
    getGroupHeaderStyle() {
        /** @type {?} */
        const styles = {};
        styles['transform'] = 'translate3d(' + this.offsetX + 'px, 0px, 0px)';
        styles['backface-visibility'] = 'hidden';
        styles['width'] = this.innerWidth;
        return styles;
    }
}
DataTableRowWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'datatable-row-wrapper',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div *ngIf="groupHeader && groupHeader.template" class="datatable-group-header" [ngStyle]="getGroupHeaderStyle()">
      <ng-template
        *ngIf="groupHeader && groupHeader.template"
        [ngTemplateOutlet]="groupHeader.template"
        [ngTemplateOutletContext]="groupContext"
      >
      </ng-template>
    </div>
    <ng-content *ngIf="(groupHeader && groupHeader.template && expanded) || (!groupHeader || !groupHeader.template)">
    </ng-content>
    <div
      *ngIf="rowDetail && rowDetail.template && expanded"
      [style.height.px]="detailRowHeight"
      class="datatable-row-detail"
    >
      <ng-template
        *ngIf="rowDetail && rowDetail.template"
        [ngTemplateOutlet]="rowDetail.template"
        [ngTemplateOutletContext]="rowContext"
      >
      </ng-template>
    </div>
  `,
                host: {
                    class: 'datatable-row-wrapper'
                }
            }] }
];
/** @nocollapse */
DataTableRowWrapperComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: KeyValueDiffers }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2JvZHkvYm9keS1yb3ctd3JhcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUVaLHVCQUF1QixFQUV2QixpQkFBaUIsRUFDakIsZUFBZSxFQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBaUMxQyxNQUFNLE9BQU8sNEJBQTRCOzs7OztJQWlEdkMsWUFBb0IsRUFBcUIsRUFBVSxPQUF3QjtRQUF2RCxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBekNqRSxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFrQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxjQUFTLEdBQUcsSUFBSSxZQUFZLENBQWlCLEtBQUssQ0FBQyxDQUFDO1FBd0I5RCxpQkFBWSxHQUFRO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRztZQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDeEIsQ0FBQztRQUVGLGVBQVUsR0FBUTtZQUNoQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3hCLENBQUM7UUFHTSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBSWpDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QyxD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dCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIERvQ2hlY2ssXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBLZXlWYWx1ZURpZmZlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEtleVZhbHVlRGlmZmVyc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1vdXNlRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdkYXRhdGFibGUtcm93LXdyYXBwZXInLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwiZ3JvdXBIZWFkZXIgJiYgZ3JvdXBIZWFkZXIudGVtcGxhdGVcIiBjbGFzcz1cImRhdGF0YWJsZS1ncm91cC1oZWFkZXJcIiBbbmdTdHlsZV09XCJnZXRHcm91cEhlYWRlclN0eWxlKClcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAqbmdJZj1cImdyb3VwSGVhZGVyICYmIGdyb3VwSGVhZGVyLnRlbXBsYXRlXCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZ3JvdXBIZWFkZXIudGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZ3JvdXBDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQgKm5nSWY9XCIoZ3JvdXBIZWFkZXIgJiYgZ3JvdXBIZWFkZXIudGVtcGxhdGUgJiYgZXhwYW5kZWQpIHx8ICghZ3JvdXBIZWFkZXIgfHwgIWdyb3VwSGVhZGVyLnRlbXBsYXRlKVwiPlxuICAgIDwvbmctY29udGVudD5cbiAgICA8ZGl2XG4gICAgICAqbmdJZj1cInJvd0RldGFpbCAmJiByb3dEZXRhaWwudGVtcGxhdGUgJiYgZXhwYW5kZWRcIlxuICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJkZXRhaWxSb3dIZWlnaHRcIlxuICAgICAgY2xhc3M9XCJkYXRhdGFibGUtcm93LWRldGFpbFwiXG4gICAgPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICpuZ0lmPVwicm93RGV0YWlsICYmIHJvd0RldGFpbC50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInJvd0RldGFpbC50ZW1wbGF0ZVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJyb3dDb250ZXh0XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2RhdGF0YWJsZS1yb3ctd3JhcHBlcidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBEYXRhVGFibGVSb3dXcmFwcGVyQ29tcG9uZW50IGltcGxlbWVudHMgRG9DaGVjayB7XG4gIEBJbnB1dCgpIGlubmVyV2lkdGg6IG51bWJlcjtcbiAgQElucHV0KCkgcm93RGV0YWlsOiBhbnk7XG4gIEBJbnB1dCgpIGdyb3VwSGVhZGVyOiBhbnk7XG4gIEBJbnB1dCgpIG9mZnNldFg6IG51bWJlcjtcbiAgQElucHV0KCkgZGV0YWlsUm93SGVpZ2h0OiBhbnk7XG4gIEBJbnB1dCgpIHJvdzogYW55O1xuICBASW5wdXQoKSBncm91cGVkUm93czogYW55O1xuICBAT3V0cHV0KCkgcm93Q29udGV4dG1lbnUgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQ7IHJvdzogYW55IH0+KGZhbHNlKTtcbiAgQE91dHB1dCgpIHJvd0luaXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogYW55IH0+KGZhbHNlKTtcblxuICBASW5wdXQoKSBzZXQgcm93SW5kZXgodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3dJbmRleCA9IHZhbDtcbiAgICB0aGlzLnJvd0NvbnRleHQucm93SW5kZXggPSB2YWw7XG4gICAgdGhpcy5ncm91cENvbnRleHQucm93SW5kZXggPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCByb3dJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3dJbmRleDtcbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBleHBhbmRlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLmdyb3VwQ29udGV4dC5leHBhbmRlZCA9IHZhbDtcbiAgICB0aGlzLnJvd0NvbnRleHQuZXhwYW5kZWQgPSB2YWw7XG4gICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XG4gIH1cblxuICBncm91cENvbnRleHQ6IGFueSA9IHtcbiAgICBncm91cDogdGhpcy5yb3csXG4gICAgZXhwYW5kZWQ6IHRoaXMuZXhwYW5kZWQsXG4gICAgcm93SW5kZXg6IHRoaXMucm93SW5kZXhcbiAgfTtcblxuICByb3dDb250ZXh0OiBhbnkgPSB7XG4gICAgcm93OiB0aGlzLnJvdyxcbiAgICBleHBhbmRlZDogdGhpcy5leHBhbmRlZCxcbiAgICByb3dJbmRleDogdGhpcy5yb3dJbmRleFxuICB9O1xuXG4gIHByaXZhdGUgcm93RGlmZmVyOiBLZXlWYWx1ZURpZmZlcjx7fSwge30+O1xuICBwcml2YXRlIF9leHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9yb3dJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycykge1xuICAgIHRoaXMucm93RGlmZmVyID0gZGlmZmVycy5maW5kKHt9KS5jcmVhdGUoKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yb3dEaWZmZXIuZGlmZih0aGlzLnJvdykpIHtcbiAgICAgIHRoaXMucm93Q29udGV4dC5yb3cgPSB0aGlzLnJvdztcbiAgICAgIHRoaXMuZ3JvdXBDb250ZXh0Lmdyb3VwID0gdGhpcy5yb3c7XG4gICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgWyckZXZlbnQnXSlcbiAgb25Db250ZXh0bWVudSgkZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnJvd0NvbnRleHRtZW51LmVtaXQoeyBldmVudDogJGV2ZW50LCByb3c6IHRoaXMucm93IH0pO1xuICB9XG5cbiAgZ2V0R3JvdXBIZWFkZXJTdHlsZSgpOiBhbnkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHt9O1xuXG4gICAgc3R5bGVzWyd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUzZCgnICsgdGhpcy5vZmZzZXRYICsgJ3B4LCAwcHgsIDBweCknO1xuICAgIHN0eWxlc1snYmFja2ZhY2UtdmlzaWJpbGl0eSddID0gJ2hpZGRlbic7XG4gICAgc3R5bGVzWyd3aWR0aCddID0gdGhpcy5pbm5lcldpZHRoO1xuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxufVxuIl19
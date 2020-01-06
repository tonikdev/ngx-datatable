/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Input, Output, EventEmitter, Directive, TemplateRef, ContentChild } from '@angular/core';
import { DatatableRowDetailTemplateDirective } from './row-detail-template.directive';
var DatatableRowDetailDirective = /** @class */ (function () {
    function DatatableRowDetailDirective() {
        /**
         * The detail row height is required especially
         * when virtual scroll is enabled.
         */
        this.rowHeight = 0;
        /**
         * Row detail row visbility was toggled.
         */
        this.toggle = new EventEmitter();
    }
    Object.defineProperty(DatatableRowDetailDirective.prototype, "template", {
        get: /**
         * @return {?}
         */
        function () {
            return this._templateInput || this._templateQuery;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggle the expansion of the row
     */
    /**
     * Toggle the expansion of the row
     * @param {?} row
     * @return {?}
     */
    DatatableRowDetailDirective.prototype.toggleExpandRow = /**
     * Toggle the expansion of the row
     * @param {?} row
     * @return {?}
     */
    function (row) {
        this.toggle.emit({
            type: 'row',
            value: row
        });
    };
    /**
     * API method to expand all the rows.
     */
    /**
     * API method to expand all the rows.
     * @return {?}
     */
    DatatableRowDetailDirective.prototype.expandAllRows = /**
     * API method to expand all the rows.
     * @return {?}
     */
    function () {
        this.toggle.emit({
            type: 'all',
            value: true
        });
    };
    /**
     * API method to collapse all the rows.
     */
    /**
     * API method to collapse all the rows.
     * @return {?}
     */
    DatatableRowDetailDirective.prototype.collapseAllRows = /**
     * API method to collapse all the rows.
     * @return {?}
     */
    function () {
        this.toggle.emit({
            type: 'all',
            value: false
        });
    };
    DatatableRowDetailDirective.decorators = [
        { type: Directive, args: [{ selector: 'ngx-datatable-row-detail' },] }
    ];
    DatatableRowDetailDirective.propDecorators = {
        rowHeight: [{ type: Input }],
        rowClass: [{ type: Input }],
        _templateInput: [{ type: Input, args: ['template',] }],
        _templateQuery: [{ type: ContentChild, args: [DatatableRowDetailTemplateDirective, { read: TemplateRef, static: true },] }],
        toggle: [{ type: Output }]
    };
    return DatatableRowDetailDirective;
}());
export { DatatableRowDetailDirective };
if (false) {
    /**
     * The detail row height is required especially
     * when virtual scroll is enabled.
     * @type {?}
     */
    DatatableRowDetailDirective.prototype.rowHeight;
    /** @type {?} */
    DatatableRowDetailDirective.prototype.rowClass;
    /** @type {?} */
    DatatableRowDetailDirective.prototype._templateInput;
    /** @type {?} */
    DatatableRowDetailDirective.prototype._templateQuery;
    /**
     * Row detail row visbility was toggled.
     * @type {?}
     */
    DatatableRowDetailDirective.prototype.toggle;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LWRldGFpbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWRhdGF0YWJsZS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3Jvdy1kZXRhaWwvcm93LWRldGFpbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRyxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUV0RjtJQUFBOzs7OztRQU1XLGNBQVMsR0FBcUQsQ0FBQyxDQUFDOzs7O1FBZS9ELFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQStCM0QsQ0FBQztJQXRDQyxzQkFBSSxpREFBUTs7OztRQUFaO1lBQ0UsT0FBTyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDcEQsQ0FBQzs7O09BQUE7SUFPRDs7T0FFRzs7Ozs7O0lBQ0gscURBQWU7Ozs7O0lBQWYsVUFBZ0IsR0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEdBQUc7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0gsbURBQWE7Ozs7SUFBYjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxFQUFFLEtBQUs7WUFDWCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRzs7Ozs7SUFDSCxxREFBZTs7OztJQUFmO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBbkRGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSwwQkFBMEIsRUFBRTs7OzRCQU1oRCxLQUFLOzJCQUNMLEtBQUs7aUNBQ0wsS0FBSyxTQUFDLFVBQVU7aUNBR2hCLFlBQVksU0FBQyxtQ0FBbUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt5QkFVckYsTUFBTTs7SUErQlQsa0NBQUM7Q0FBQSxBQXBERCxJQW9EQztTQW5EWSwyQkFBMkI7Ozs7Ozs7SUFLdEMsZ0RBQXlFOztJQUN6RSwrQ0FBdUI7O0lBQ3ZCLHFEQUNpQzs7SUFFakMscURBQ2lDOzs7OztJQVNqQyw2Q0FBeUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYsIENvbnRlbnRDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0YXRhYmxlUm93RGV0YWlsVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tICcuL3Jvdy1kZXRhaWwtdGVtcGxhdGUuZGlyZWN0aXZlJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmd4LWRhdGF0YWJsZS1yb3ctZGV0YWlsJyB9KVxuZXhwb3J0IGNsYXNzIERhdGF0YWJsZVJvd0RldGFpbERpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgZGV0YWlsIHJvdyBoZWlnaHQgaXMgcmVxdWlyZWQgZXNwZWNpYWxseVxuICAgKiB3aGVuIHZpcnR1YWwgc2Nyb2xsIGlzIGVuYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKSByb3dIZWlnaHQ6IG51bWJlciB8ICgocm93PzogYW55LCBpbmRleD86IG51bWJlcikgPT4gbnVtYmVyKSA9IDA7XG4gIEBJbnB1dCgpIHJvd0NsYXNzOiBhbnk7XG4gIEBJbnB1dCgndGVtcGxhdGUnKVxuICBfdGVtcGxhdGVJbnB1dDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAQ29udGVudENoaWxkKERhdGF0YWJsZVJvd0RldGFpbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgX3RlbXBsYXRlUXVlcnk6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgZ2V0IHRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZUlucHV0IHx8IHRoaXMuX3RlbXBsYXRlUXVlcnk7XG4gIH1cblxuICAvKipcbiAgICogUm93IGRldGFpbCByb3cgdmlzYmlsaXR5IHdhcyB0b2dnbGVkLlxuICAgKi9cbiAgQE91dHB1dCgpIHRvZ2dsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIFRvZ2dsZSB0aGUgZXhwYW5zaW9uIG9mIHRoZSByb3dcbiAgICovXG4gIHRvZ2dsZUV4cGFuZFJvdyhyb3c6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgdHlwZTogJ3JvdycsXG4gICAgICB2YWx1ZTogcm93XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIG1ldGhvZCB0byBleHBhbmQgYWxsIHRoZSByb3dzLlxuICAgKi9cbiAgZXhwYW5kQWxsUm93cygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgbWV0aG9kIHRvIGNvbGxhcHNlIGFsbCB0aGUgcm93cy5cbiAgICovXG4gIGNvbGxhcHNlQWxsUm93cygpOiB2b2lkIHtcbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHR5cGU6ICdhbGwnLFxuICAgICAgdmFsdWU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
/**
 * Estimating Model
 * Represents an estimate in the Estimating and Quoting module
 * 
 * This model handles all estimate-related data including:
 * - Client information
 * - Project details
 * - Line items
 * - Pricing calculations
 * - Terms and conditions
 */

class EstimateModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.estimateNumber = data.estimateNumber || '';
    this.clientId = data.clientId || '';
    this.projectName = data.projectName || '';
    this.description = data.description || '';
    this.status = data.status || 'draft';
    this.issueDate = data.issueDate || new Date();
    this.expiryDate = data.expiryDate || null;
    this.lineItems = data.lineItems || [];
    this.subtotal = data.subtotal || 0;
    this.taxRate = data.taxRate || 0;
    this.taxAmount = data.taxAmount || 0;
    this.discount = data.discount || 0;
    this.total = data.total || 0;
    this.notes = data.notes || '';
    this.terms = data.terms || '';
    this.createdBy = data.createdBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.approvedBy = data.approvedBy || null;
    this.approvedAt = data.approvedAt || null;
    this.customFields = data.customFields || {};
  }

  calculateSubtotal() {
    this.subtotal = this.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    return this.subtotal;
  }

  calculateTaxAmount() {
    this.taxAmount = (this.subtotal - this.discount) * (this.taxRate / 100);
    return this.taxAmount;
  }

  calculateTotal() {
    this.total = (this.subtotal - this.discount) + this.taxAmount;
    return this.total;
  }

  recalculate() {
    this.calculateSubtotal();
    this.calculateTaxAmount();
    this.calculateTotal();
    return this;
  }

  addLineItem(item) {
    this.lineItems.push(item);
    return this.recalculate();
  }

  removeLineItem(index) {
    if (index >= 0 && index < this.lineItems.length) {
      this.lineItems.splice(index, 1);
      return this.recalculate();
    }
    return this;
  }

  updateLineItem(index, item) {
    if (index >= 0 && index < this.lineItems.length) {
      this.lineItems[index] = { ...this.lineItems[index], ...item };
      return this.recalculate();
    }
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      estimateNumber: this.estimateNumber,
      clientId: this.clientId,
      projectName: this.projectName,
      description: this.description,
      status: this.status,
      issueDate: this.issueDate,
      expiryDate: this.expiryDate,
      lineItems: this.lineItems,
      subtotal: this.subtotal,
      taxRate: this.taxRate,
      taxAmount: this.taxAmount,
      discount: this.discount,
      total: this.total,
      notes: this.notes,
      terms: this.terms,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      customFields: this.customFields
    };
  }

  static fromJSON(json) {
    return new EstimateModel(json);
  }

  static getValidStatuses() {
    return ['draft', 'sent', 'approved', 'rejected', 'expired'];
  }
}

export default EstimateModel;

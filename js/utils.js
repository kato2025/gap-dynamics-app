// Utility functions

/**
 * Classify gap size according to Brokaw's classification
 * @param {number} area - Gap area in square meters
 * @returns {string} Classification label
 */
function brokawClassification(area) {
  if (area < 100) return "Small gap";
  if (area <= 400) return "Medium gap";
  return "Large gap";
}

/**
 * Get HTML badge for classification
 * @param {string} classification - Classification label
 * @returns {string} HTML string with badge
 */
function getClassBadge(classification) {
  if (classification === "Small gap") return '<span class="badge badge-small">Small gap</span>';
  if (classification === "Medium gap") return '<span class="badge badge-medium">Medium gap</span>';
  return '<span class="badge badge-large">Large gap</span>';
}

/**
 * Get gap information from form inputs
 * @returns {object} Gap information object
 */
function getGapInfo() {
  return {
    plotNumber: document.getElementById("plotNumber").value,
    gapNumber: document.getElementById("gapNumber").value,
    causalFactor: document.getElementById("causalFactor").value,
    speciesInvolved: document.getElementById("speciesInvolved").value
  };
}
// Main application logic

// Global state
let results = [];
let currentLocation = "";
let allowNavigation = false;
let editingRecordId = null;

/**
 * Add a new result to the results array
 * @param {string} method - Calculation method used
 * @param {number} area - Calculated area
 * @param {Object} calculationInputs - The inputs used for calculation
 */
function addResult(method, area, calculationInputs) {
  const gapInfo = getGapInfo();
  
  results.push({
    id: results.length + 1,
    plotNumber: gapInfo.plotNumber,
    gapNumber: gapInfo.gapNumber,
    speciesInvolved: gapInfo.speciesInvolved,
    causalFactor: gapInfo.causalFactor,
    method: method,
    area: area,
    classification: brokawClassification(area),
    calculationInputs: calculationInputs
  });
  
  renderTable();
  updateExportButton();
  updateLocationHeader();
}

/**
 * Get gap information from form
 * @returns {Object} Gap information
 */
function getGapInfo() {
  return {
    plotNumber: document.getElementById("plotNumber").value.trim(),
    gapNumber: document.getElementById("gapNumber").value.trim(),
    speciesInvolved: document.getElementById("speciesInvolved").value.trim(),
    causalFactor: document.getElementById("causalFactor").value
  };
}

/**
 * Classify gap size according to Brokaw's classification
 * @param {number} area - Gap area in m²
 * @returns {string} Classification
 */
function brokawClassification(area) {
  if (area < 100) {
    return "Small gap";
  } else if (area <= 400) {
    return "Medium gap";
  } else {
    return "Large gap";
  }
}

/**
 * Get classification badge HTML
 * @param {string} classification - Gap classification
 * @returns {string} HTML for badge
 */
function getClassBadge(classification) {
  const badges = {
    "Small gap": '<span class="badge badge-small">Small</span>',
    "Medium gap": '<span class="badge badge-medium">Medium</span>',
    "Large gap": '<span class="badge badge-large">Large</span>'
  };
  return badges[classification] || classification;
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners for required fields
  document.getElementById("location").addEventListener("input", checkRequiredFields);
  document.getElementById("plotNumber").addEventListener("input", checkRequiredFields);
  document.getElementById("gapNumber").addEventListener("input", checkRequiredFields);
  document.getElementById("causalFactor").addEventListener("change", checkRequiredFields);
  
  // Warn user before page refresh if there's unsaved data
  window.addEventListener('beforeunload', function(e) {
    if (results.length > 0 && !allowNavigation) {
      e.preventDefault();
      e.returnValue = 'You have unsaved data. Are you sure you want to leave?';
      return e.returnValue;
    }
  });
  
  // Intercept F5 and Ctrl+R for refresh
  document.addEventListener('keydown', function(e) {
    // F5 or Ctrl+R or Cmd+R
    if ((e.key === 'F5') || 
        ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
      if (results.length > 0 && !allowNavigation) {
        e.preventDefault();
        document.getElementById("refreshWarningModal").classList.add("show");
      }
    }
  });
  
  // Initialize UI
  checkRequiredFields();
  updateExportButton();
});

// Make functions available globally
window.showGridMethod = showGridMethod;
window.showEllipseMethod = showEllipseMethod;
window.calculateGrid = calculateGrid;
window.calculateEllipse = calculateEllipse;
window.exportCSV = exportCSV;
window.back = back;
window.showNewLocationModal = showNewLocationModal;
window.closeModal = closeModal;
window.clearDataWithoutExport = clearDataWithoutExport;
window.exportAndClear = exportAndClear;
window.cancelRefresh = cancelRefresh;
window.proceedWithoutExport = proceedWithoutExport;
window.exportAndLeave = exportAndLeave;
window.deleteRecord = deleteRecord;
window.editRecord = editRecord;
window.closeEditModal = closeEditModal;
window.saveEditedRecord = saveEditedRecord;
window.recalculateArea = recalculateArea;
window.brokawClassification = brokawClassification;
window.getClassBadge = getClassBadge;
window.toggleMenu = toggleMenu;
window.showUserGuide = showUserGuide;
window.closeUserGuide = closeUserGuide;
window.showAboutDeveloper = showAboutDeveloper;
window.closeAboutDeveloper = closeAboutDeveloper;
window.openCSVFile = openCSVFile;
window.showCSVImportModal = showCSVImportModal;
window.cancelCSVImport = cancelCSVImport;
window.confirmCSVImport = confirmCSVImport;
window.importCSVReplace = importCSVReplace;
// UI manipulation functions

/**
 * Show grid method form
 */
function showGridMethod() {
  if (document.getElementById("gridMethodCard").classList.contains("disabled")) {
    alert("Please fill in all required gap information fields first.");
    return;
  }
  toggle(false);
  document.getElementById("gridMethod").classList.remove("hidden");
}

/**
 * Show ellipse method form
 */
function showEllipseMethod() {
  if (document.getElementById("ellipseMethodCard").classList.contains("disabled")) {
    alert("Please fill in all required gap information fields first.");
    return;
  }
  toggle(false);
  document.getElementById("ellipseMethod").classList.remove("hidden");
}

/**
 * Go back to method selection
 */
function back() {
  toggle(true);
}

/**
 * Toggle visibility of method selection and forms
 * @param {boolean} showSelection - Whether to show method selection
 */
function toggle(showSelection) {
  document.getElementById("methodSelection").classList.toggle("hidden", !showSelection);
  document.getElementById("gridMethod").classList.add("hidden");
  document.getElementById("ellipseMethod").classList.add("hidden");
}

/**
 * Render results table
 */
function renderTable() {
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";
  
  results.forEach(r => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <div class="result-card-header">
        <div class="result-card-id">${r.id}</div>
      </div>
      <div class="result-card-body">
        <div class="result-field">
          <div class="result-field-label">Plot Number</div>
          <div class="result-field-value">${r.plotNumber}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Gap Number</div>
          <div class="result-field-value">${r.gapNumber}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Species Involved</div>
          <div class="result-field-value">${r.speciesInvolved || 'N/A'}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Causal Factor(s)</div>
          <div class="result-field-value">${r.causalFactor}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Method</div>
          <div class="result-field-value">${r.method}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Gap Size (m²)</div>
          <div class="result-field-value">${r.area.toFixed(2)}</div>
        </div>
        <div class="result-field">
          <div class="result-field-label">Brokaw's Classification</div>
          <div class="result-field-value">${r.classification}</div>
        </div>
      </div>
      <div class="result-card-actions">
        <button class="btn-action btn-edit" onclick="editRecord(${r.id})" title="Edit">
          ✏️ Edit
        </button>
        <button class="btn-action btn-delete" onclick="deleteRecord(${r.id})" title="Delete">
          🗑️ Delete
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * Update export button state
 */
function updateExportButton() {
  const exportBtn = document.getElementById("exportBtn");
  exportBtn.disabled = results.length === 0;
}

/**
 * Update location header display
 */
function updateLocationHeader() {
  const locationHeader = document.getElementById("locationHeader");
  const locationName = document.getElementById("locationName");
  const locationInput = document.getElementById("location").value.trim();
  
  if (locationInput && results.length > 0) {
    currentLocation = locationInput;
    locationName.textContent = currentLocation;
    locationHeader.classList.remove("hidden");
  } else {
    locationHeader.classList.add("hidden");
  }
}

/**
 * Check if all required fields are filled
 */
function checkRequiredFields() {
  const location = document.getElementById("location").value.trim();
  const plotNumber = document.getElementById("plotNumber").value.trim();
  const gapNumber = document.getElementById("gapNumber").value.trim();
  const causalFactor = document.getElementById("causalFactor").value;

  const allFilled = location && plotNumber && gapNumber && causalFactor;
  
  const gridCard = document.getElementById("gridMethodCard");
  const ellipseCard = document.getElementById("ellipseMethodCard");
  
  if (allFilled) {
    gridCard.classList.remove("disabled");
    ellipseCard.classList.remove("disabled");
    currentLocation = location;
  } else {
    gridCard.classList.add("disabled");
    ellipseCard.classList.add("disabled");
  }
}

/**
 * Export results to CSV
 */
function exportCSV() {
  if (results.length === 0) return;
  
  // Create CSV content with center-aligned ID column hint
  let csv = `Location: ${currentLocation}\n\n`;
  csv += "ID,Plot Number,Gap Number,Species Involved,Causal factor(s),Method,Gap Size (m²),Brokaw's Classification\n";
  
  results.forEach(r => {
    // Add spaces around ID to visually center it (works in text editors)
    const centeredId = ` ${r.id} `;
    const species = r.speciesInvolved || 'N/A';
    csv += `"${centeredId}","${r.plotNumber}","${r.gapNumber}","${species}","${r.causalFactor}","${r.method}","${r.area.toFixed(2)}","${r.classification}"\n`;
  });
  
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${currentLocation} Gap Information.csv`;
  link.click();
}

/**
 * Show new location modal
 */
function showNewLocationModal() {
  if (results.length === 0) {
    clearAllData();
    return;
  }
  document.getElementById("newLocationModal").classList.add("show");
}

/**
 * Close modal
 */
function closeModal() {
  document.getElementById("newLocationModal").classList.remove("show");
}

/**
 * Clear data without exporting
 */
function clearDataWithoutExport() {
  clearAllData();
  closeModal();
}

/**
 * Export and then clear data
 */
function exportAndClear() {
  exportCSV();
  clearAllData();
  closeModal();
}

/**
 * Clear all application data
 */
function clearAllData() {
  results = [];
  currentLocation = "";
  document.getElementById("location").value = "";
  document.getElementById("plotNumber").value = "";
  document.getElementById("gapNumber").value = "";
  document.getElementById("causalFactor").value = "";
  document.getElementById("speciesInvolved").value = "";
  renderTable();
  updateExportButton();
  updateLocationHeader();
  checkRequiredFields();
}

/**
 * Close refresh warning modal and cancel navigation
 */
function cancelRefresh() {
  document.getElementById("refreshWarningModal").classList.remove("show");
  allowNavigation = false;
}

/**
 * Proceed without exporting data
 */
function proceedWithoutExport() {
  document.getElementById("refreshWarningModal").classList.remove("show");
  allowNavigation = true;
  window.location.reload();
}

/**
 * Export data and then leave
 */
function exportAndLeave() {
  exportCSV();
  document.getElementById("refreshWarningModal").classList.remove("show");
  allowNavigation = true;
  // Give a moment for the download to start
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

/**
 * Delete a record
 * @param {number} id - Record ID to delete
 */
function deleteRecord(id) {
  if (confirm("Are you sure you want to delete this record?")) {
    results = results.filter(r => r.id !== id);
    // Reassign IDs to maintain sequence
    results.forEach((r, index) => {
      r.id = index + 1;
    });
    renderTable();
    updateExportButton();
    updateLocationHeader();
  }
}

/**
 * Edit a record
 * @param {number} id - Record ID to edit
 */
function editRecord(id) {
  const record = results.find(r => r.id === id);
  if (!record) return;
  
  // Store the record being edited
  editingRecordId = id;
  
  // Populate edit modal with record data
  document.getElementById("editPlotNumber").value = record.plotNumber;
  document.getElementById("editGapNumber").value = record.gapNumber;
  document.getElementById("editSpeciesInvolved").value = record.speciesInvolved || '';
  document.getElementById("editCausalFactor").value = record.causalFactor;
  document.getElementById("editMethod").value = record.method;
  
  // Show/hide calculation inputs based on method
  const gridInputs = document.getElementById("editGridInputs");
  const ellipseInputs = document.getElementById("editEllipseInputs");
  
if (record.method === "Grid–Quadrat") {
  gridInputs.classList.remove("hidden");
  ellipseInputs.classList.add("hidden");
  document.getElementById("editNumSquares").value = record.calculationInputs.numSquares;
  document.getElementById("editAreaSquare").value = record.calculationInputs.areaSquare;
  
  // Populate square side if available
  if (record.calculationInputs.squareSide) {
    document.getElementById("editSquareSide").value = record.calculationInputs.squareSide;
  }

  } else if (record.method === "Ellipse Approximation") {
    gridInputs.classList.add("hidden");
    ellipseInputs.classList.remove("hidden");
    document.getElementById("editShortRadius").value = record.calculationInputs.shortRadius;
    document.getElementById("editLongRadius").value = record.calculationInputs.longRadius;
  }
  
  // Initialize the calculated display
  recalculateArea();
  
  // Show the edit modal
  document.getElementById("editModal").classList.add("show");
}

/**
 * Close edit modal
 */
function closeEditModal() {
  document.getElementById("editModal").classList.remove("show");
  editingRecordId = null;
}

/**
 * Recalculate area based on current input values
 */
function recalculateArea() {
  if (editingRecordId === null) return;
  
  const record = results.find(r => r.id === editingRecordId);
  if (!record) return;
  
  let newArea = 0;
  let isValid = true;
  
  if (record.method === "Grid–Quadrat") {
    const numSquares = parseFloat(document.getElementById("editNumSquares").value);
    const areaSquare = parseFloat(document.getElementById("editAreaSquare").value);
    
    if (!numSquares || !areaSquare || numSquares <= 0 || areaSquare <= 0) {
      isValid = false;
    } else {
      newArea = numSquares * areaSquare;
    }
    
  } else if (record.method === "Ellipse Approximation") {
    const shortRadius = parseFloat(document.getElementById("editShortRadius").value);
    const longRadius = parseFloat(document.getElementById("editLongRadius").value);
    
    if (!shortRadius || !longRadius || shortRadius <= 0 || longRadius <= 0) {
      isValid = false;
    } else if (longRadius <= shortRadius) {
      isValid = false;
    } else {
      newArea = Math.PI * shortRadius * longRadius;
    }
  }
  
  // Update the display
  if (isValid && newArea > 0) {
    const classification = brokawClassification(newArea);
    document.getElementById("editCalculatedArea").textContent = newArea.toFixed(2);
    document.getElementById("editCalculatedClassification").textContent = classification;
  } else {
    document.getElementById("editCalculatedArea").textContent = "0.00";
    document.getElementById("editCalculatedClassification").textContent = "-";
  }
}

/**
 * Save edited record
 */
function saveEditedRecord() {
  if (editingRecordId === null) return;
  
  const plotNumber = document.getElementById("editPlotNumber").value.trim();
  const gapNumber = document.getElementById("editGapNumber").value.trim();
  const speciesInvolved = document.getElementById("editSpeciesInvolved").value.trim();
  const causalFactor = document.getElementById("editCausalFactor").value;
  
  // Validate required fields
  if (!plotNumber || !gapNumber || !causalFactor) {
    alert("Please fill in all required fields.");
    return;
  }
  
  // Find and update the record
  const record = results.find(r => r.id === editingRecordId);
  if (record) {
    record.plotNumber = plotNumber;
    record.gapNumber = gapNumber;
    record.speciesInvolved = speciesInvolved;
    record.causalFactor = causalFactor;
    
    // Update calculation inputs and recalculate area
    if (record.method === "Grid–Quadrat") {
      const numSquares = parseFloat(document.getElementById("editNumSquares").value);
      const areaSquare = parseFloat(document.getElementById("editAreaSquare").value);
      const squareSide = parseFloat(document.getElementById("editSquareSide").value);
      
      if (!numSquares || !areaSquare || numSquares <= 0 || areaSquare <= 0) {
        alert("Please enter valid positive numbers for grid calculations.");
        return;
      }
      
      record.calculationInputs = { 
        numSquares, 
        areaSquare,
        squareSide: squareSide || null
      };
      record.area = numSquares * areaSquare;
      
    } else if (record.method === "Ellipse Approximation") {
      const shortRadius = parseFloat(document.getElementById("editShortRadius").value);
      const longRadius = parseFloat(document.getElementById("editLongRadius").value);
      
      if (!shortRadius || !longRadius || shortRadius <= 0 || longRadius <= 0) {
        alert("Please enter valid positive numbers for ellipse calculations.");
        return;
      }
      
      if (longRadius <= shortRadius) {
        alert("⚠️ Invalid Input: The long radius must be greater than the short radius.");
        return;
      }
      
      record.calculationInputs = { shortRadius, longRadius };
      record.area = Math.PI * shortRadius * longRadius;
    }
    
    // Update classification based on new area
    record.classification = brokawClassification(record.area);
    
    // Re-render the table to show updated values
    renderTable();
    closeEditModal();
  }
}
/**
 * Toggle dropdown menu
 */
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

/**
 * Show user guide modal
 */
function showUserGuide() {
  document.getElementById("userGuideModal").classList.add("show");
  document.getElementById("dropdownMenu").classList.remove("show");
}

/**
 * Close user guide modal
 */
function closeUserGuide() {
  document.getElementById("userGuideModal").classList.remove("show");
}

/**
 * Show about developer modal
 */
function showAboutDeveloper() {
  document.getElementById("aboutDeveloperModal").classList.add("show");
  document.getElementById("dropdownMenu").classList.remove("show");
}

/**
 * Close about developer modal
 */
function closeAboutDeveloper() {
  document.getElementById("aboutDeveloperModal").classList.remove("show");
}

// Close dropdown menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById("dropdownMenu");
  const menuBtn = document.querySelector(".menu-btn");
  
  if (menu && menuBtn && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
    menu.classList.remove("show");
  }
});

// CSV Import State
let pendingCSVData = null;

/**
 * Trigger file input for CSV import
 */
function openCSVFile() {
  document.getElementById("dropdownMenu").classList.remove("show");
  document.getElementById("csvFileInput").click();
}

/**
 * Show CSV import confirmation modal
 */
function showCSVImportModal(data, fileName) {
  const modal = document.getElementById("csvImportModal");
  const message = document.getElementById("csvImportMessage");
  const preview = document.getElementById("csvPreview");
  const previewContent = document.getElementById("csvPreviewContent");
  const replaceBtn = document.getElementById("replaceBtn");
  
  pendingCSVData = data;
  
  // Create preview
  let previewText = `<strong>File:</strong> ${fileName}<br>`;
  previewText += `<strong>Records found:</strong> ${data.records.length}<br>`;
  if (data.location) {
    previewText += `<strong>Location:</strong> ${data.location}`;
  }
  
  previewContent.innerHTML = previewText;
  preview.style.display = 'block';
  
  if (results.length > 0) {
    message.textContent = `You have ${results.length} existing record(s). Do you want to add these ${data.records.length} new record(s) or replace all existing data?`;
    replaceBtn.style.display = 'inline-block';
  } else {
    message.textContent = `Import ${data.records.length} record(s) from ${fileName}?`;
    replaceBtn.style.display = 'none';
  }
  
  modal.classList.add("show");
}

/**
 * Cancel CSV import
 */
function cancelCSVImport() {
  document.getElementById("csvImportModal").classList.remove("show");
  pendingCSVData = null;
  document.getElementById("csvFileInput").value = "";
}

/**
 * Confirm CSV import (add to existing data)
 */
function confirmCSVImport() {
  if (!pendingCSVData) return;
  
  const startId = results.length + 1;
  pendingCSVData.records.forEach((record, index) => {
    results.push({
      id: startId + index,
      plotNumber: record.plotNumber,
      gapNumber: record.gapNumber,
      speciesInvolved: record.speciesInvolved,
      causalFactor: record.causalFactor,
      method: record.method,
      area: record.area,
      classification: record.classification,
      calculationInputs: record.calculationInputs
    });
  });
  
  // Set location but don't update currentLocation to keep fields editable
  if (pendingCSVData.location && !document.getElementById("location").value.trim()) {
    document.getElementById("location").value = pendingCSVData.location;
  }
  
  renderTable();
  updateExportButton();
  updateLocationHeader();
  
  // Trigger checkRequiredFields to update UI state
  checkRequiredFields();
  
  cancelCSVImport();
  
  alert(`Successfully imported ${pendingCSVData.records.length} record(s)!`);
}

/**
 * Import CSV and replace existing data
 */
function importCSVReplace() {
  if (!pendingCSVData) return;
  
  results = [];
  pendingCSVData.records.forEach((record, index) => {
    results.push({
      id: index + 1,
      plotNumber: record.plotNumber,
      gapNumber: record.gapNumber,
      speciesInvolved: record.speciesInvolved,
      causalFactor: record.causalFactor,
      method: record.method,
      area: record.area,
      classification: record.classification,
      calculationInputs: record.calculationInputs
    });
  });
  
  // Set location value but don't lock currentLocation yet
  if (pendingCSVData.location) {
    document.getElementById("location").value = pendingCSVData.location;
  }
  
  renderTable();
  updateExportButton();
  updateLocationHeader();
  
  // Trigger checkRequiredFields to update UI state
  checkRequiredFields();
  
  cancelCSVImport();
  
  alert(`Successfully imported ${pendingCSVData.records.length} record(s)! Previous data was replaced.`);
}

/**
 * Parse CSV file
 */
function parseCSVFile(file) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const text = e.target.result;
      // Split by newlines but keep all lines for processing
      let lines = text.split(/\r?\n/);
      
      if (lines.length < 3) {
        alert("Invalid CSV file format. File appears to be empty or corrupted.");
        return;
      }
      
      // Extract location from first line
      let location = "";
      let dataStartIndex = 0;
      
      if (lines[0].trim().startsWith("Location:")) {
        location = lines[0].replace("Location:", "").trim();
        dataStartIndex = 2; // Skip location line and empty line
      }
      
      // Find the header line
      let headerIndex = dataStartIndex;
      while (headerIndex < lines.length && !lines[headerIndex].trim().includes("ID")) {
        headerIndex++;
      }
      
      if (headerIndex >= lines.length) {
        alert("Could not find CSV header row.");
        return;
      }
      
      // Parse header
      const headers = parseCSVLine(lines[headerIndex]);
      const records = [];
      
      // Parse data rows (start after header)
      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        const values = parseCSVLine(line);
        
        // Ensure we have enough columns
        if (values.length < 8) {
          console.warn(`Skipping incomplete row ${i}:`, values);
          continue;
        }
        
        // Extract values - handle extra spaces from centering
        const id = values[0].trim();
        const plotNumber = values[1].trim();
        const gapNumber = values[2].trim();
        const speciesInvolved = values[3].trim() === 'N/A' ? '' : values[3].trim();
        const causalFactor = values[4].trim();
        const method = values[5].trim();
        const areaStr = values[6].trim();
        const classification = values[7].trim();
        
        // Validate area is a number
        const area = parseFloat(areaStr);
        if (isNaN(area)) {
          console.warn(`Skipping row ${i} - invalid area:`, areaStr);
          continue;
        }
        
        // Reconstruct calculation inputs based on method
        let calculationInputs = {};
        if (method === "Grid–Quadrat") {
          // We can't perfectly reconstruct, so we'll use approximations
          const approxSquareArea = 4; // Assume 4m² squares
          const approxSide = Math.sqrt(approxSquareArea);
          calculationInputs = {
            numSquares: Math.round(area / approxSquareArea),
            areaSquare: approxSquareArea,
            squareSide: approxSide
          };
        } else if (method === "Ellipse Approximation") {
          // Approximate radii from area
          const avgRadius = Math.sqrt(area / Math.PI);
          calculationInputs = {
            shortRadius: parseFloat((avgRadius * 0.8).toFixed(2)),
            longRadius: parseFloat((avgRadius * 1.2).toFixed(2))
          };
        }
        
        records.push({
          plotNumber,
          gapNumber,
          speciesInvolved,
          causalFactor,
          method,
          area,
          classification,
          calculationInputs
        });
      }
      
      if (records.length === 0) {
        alert("No valid records found in the CSV file.");
        return;
      }
      
      console.log(`Successfully parsed ${records.length} records from CSV`);
      showCSVImportModal({ location, records }, file.name);
      
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Error parsing CSV file. Please ensure it's in the correct format.\n\nError: " + error.message);
    }
  };
  
  reader.onerror = function() {
    alert("Error reading file. Please try again.");
  };
  
  reader.readAsText(file);
}

/**
 * Parse a single CSV line (handles quoted fields)
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Initialize CSV file input listener
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('csvFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.name.endsWith('.csv')) {
          alert("Please select a CSV file.");
          return;
        }
        parseCSVFile(file);
      }
    });
  }
});

// Online/Offline Status
function updateOnlineStatus() {
  const statusElement = document.getElementById('onlineStatus');
  if (statusElement) {
    if (navigator.onLine) {
      statusElement.textContent = '● Online';
      statusElement.className = 'status-online';
    } else {
      statusElement.textContent = '● Offline';
      statusElement.className = 'status-offline';
    }
  }
}

// Initialize online/offline listeners
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Update status on page load
document.addEventListener('DOMContentLoaded', function() {
  updateOnlineStatus();
});

/**
 * Calculate square area in edit modal
 */
function calculateEditSquareArea() {
  const side = Number(document.getElementById("editSquareSide").value);
  
  if (!side) {
    alert("Please enter the length of the square's side.");
    return;
  }
  
  if (side <= 0) {
    alert("Side length must be a positive number.");
    return;
  }
  
  // Calculate area (side²)
  const area = side * side;
  
  // Set the calculated area in the editAreaSquare field
  document.getElementById("editAreaSquare").value = area.toFixed(2);
  
  // Trigger recalculation of gap area
  recalculateArea();
  
  // Visual feedback
  const areaInput = document.getElementById("editAreaSquare");
  areaInput.style.background = "#d4edda";
  areaInput.style.borderColor = "#28a745";
  
  // Reset visual feedback after 2 seconds
  setTimeout(() => {
    areaInput.style.background = "#f5f5f5";
    areaInput.style.borderColor = "#e0e0e0";
  }, 2000);
}

/**
 * Print results
 */
function printResults() {
  document.getElementById("dropdownMenu").classList.remove("show");
  
  if (results.length === 0) {
    alert("No results to print. Please add some gap measurements first.");
    return;
  }
  
  // Update print header
  const printLocation = document.getElementById("printLocation");
  const printDate = document.getElementById("printDate");
  const printTimestamp = document.getElementById("printTimestamp");
  
  if (printLocation) {
    printLocation.textContent = currentLocation ? `Location: ${currentLocation}` : "Location: Not specified";
  }
  
  if (printDate) {
    const now = new Date();
    printDate.textContent = `Report generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  
  if (printTimestamp) {
    const now = new Date();
    printTimestamp.textContent = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
  }
  
  // Calculate summary statistics
  let smallCount = 0;
  let mediumCount = 0;
  let largeCount = 0;
  
  results.forEach(r => {
    if (r.classification === "Small gap") smallCount++;
    else if (r.classification === "Medium gap") mediumCount++;
    else if (r.classification === "Large gap") largeCount++;
  });
  
  // Update summary table
  document.getElementById("printTotalGaps").textContent = results.length;
  document.getElementById("printSmallGaps").textContent = smallCount;
  document.getElementById("printMediumGaps").textContent = mediumCount;
  document.getElementById("printLargeGaps").textContent = largeCount;
  
  // Create print table
  createPrintTable();
  
  // Trigger print dialog
  setTimeout(() => {
    window.print();
  }, 100);
}

/**
 * Create print table from results
 */
function createPrintTable() {
  const container = document.getElementById("resultsContainer");
  
  // Create table element
  let tableHTML = `
    <table class="print-table" style="display: none;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Plot</th>
          <th>Gap</th>
          <th>Species Involved</th>
          <th>Causal Factor(s)</th>
          <th>Method</th>
          <th>Gap Size (m²)</th>
          <th>Brokaw's Classification</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Add data rows
  results.forEach(r => {
    tableHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${r.plotNumber}</td>
        <td>${r.gapNumber}</td>
        <td>${r.speciesInvolved || 'N/A'}</td>
        <td>${r.causalFactor}</td>
        <td>${r.method}</td>
        <td>${r.area.toFixed(2)}</td>
        <td>${r.classification}</td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  // Check if print table already exists, if so remove it
  const existingTable = container.querySelector('.print-table');
  if (existingTable) {
    existingTable.remove();
  }
  
  // Append new table to container
  container.insertAdjacentHTML('beforeend', tableHTML);
}
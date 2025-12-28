// Calculation functions
/**
 * Calculate area of one square from side length
 */
function calculateSquareArea() {
  const side = Number(document.getElementById("squareSide").value);
  
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
  
  // Set the calculated area in the areaSquare field
  document.getElementById("areaSquare").value = area.toFixed(2);
  
  // Visual feedback
  const areaInput = document.getElementById("areaSquare");
  areaInput.style.background = "#d4edda";
  areaInput.style.borderColor = "#28a745";
  
  // Reset visual feedback after 2 seconds
  setTimeout(() => {
    areaInput.style.background = "#f5f5f5";
    areaInput.style.borderColor = "#e0e0e0";
  }, 2000);
}

/**
 * Calculate grid-quadrat method area
 */
function calculateGrid() {
  const n = Number(document.getElementById("numSquares").value);
  const a = Number(document.getElementById("areaSquare").value);
  const side = Number(document.getElementById("squareSide").value);
  
  if (n && a) {
    const calculationInputs = {
      numSquares: n,
      areaSquare: a,
      squareSide: side || null
    };
    addResult("Grid–Quadrat", n * a, calculationInputs);
    
    // Clear all fields
    document.getElementById("numSquares").value = "";
    document.getElementById("areaSquare").value = "";
    document.getElementById("squareSide").value = "";
    
    back();
  } else {
    alert("Please fill in all required fields (Number of Squares and Area of One Square)");
  }
}

/**
 * Calculate ellipse approximation area
 */
function calculateEllipse() {
  const s = Number(document.getElementById("shortRadius").value);
  const l = Number(document.getElementById("longRadius").value);
  
  if (s && l) {
    // Validate that long radius is greater than short radius
    if (l <= s) {
      alert("⚠️ Invalid Input: The long radius must be greater than the short radius.\n\nPlease adjust your measurements so that:\nLong Radius > Short Radius");
      return;
    }
    
    const calculationInputs = {
      shortRadius: s,
      longRadius: l
    };
    addResult("Ellipse Approximation", Math.PI * s * l, calculationInputs);
    document.getElementById("shortRadius").value = "";
    document.getElementById("longRadius").value = "";
    back();
  } else {
    alert("Please fill in all fields");
  }
}
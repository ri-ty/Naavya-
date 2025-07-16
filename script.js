function performSearch() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    alert("You searched for: " + input);
  
    // TODO: Add actual product filtering logic here later
  }

  function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("show");
  }
  
  function toggleFilter() {
    document.getElementById("filterPanel").classList.toggle("open");
  }
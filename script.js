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


  function toggleCart() {
    const cartPanel = document.getElementById("cartPanel");
    cartPanel.classList.toggle("open");
  }

  

  document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');
  
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('liked');
      });
    });
  });
  



  document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-button');
  
    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.product-card');
        const title = card.dataset.title;
        const price = card.dataset.price;
  
        const frontImg = card.querySelector('.product-img.front').getAttribute('src');
        const backImg = card.querySelector('.product-img.back').getAttribute('src');
  
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
        // Check if already in wishlist
        const exists = wishlist.find(item => item.title === title);
  
        if (!exists) {
          wishlist.push({ title, price, frontImg, backImg });
          button.classList.add('liked');
        } else {
          wishlist = wishlist.filter(item => item.title !== title);
          button.classList.remove('liked');
        }
  
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      });
    });
  });
  


 

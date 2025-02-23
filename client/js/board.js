document.addEventListener('DOMContentLoaded', () => {
    // Fetch existing columns and cards from the backend when the page loads
    // Example of adding a card programmatically (it would be dynamic):
    const todoColumn = document.getElementById('todo-column');
    const addButton = document.querySelector("button");
    addButton.addEventListener('click', () => {
      const card = document.createElement('div');
      card.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');
      card.innerHTML = 'New Card';
      todoColumn.appendChild(card);
    });
  });
  
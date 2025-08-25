// app.js

console.log("My board is ready.");

function initDnD() {
  document.querySelectorAll('.cards-container').forEach((listEl) => {
    if (listEl.__sortableInited) return; // ettei alusteta kahdesti

    new Sortable(listEl, {
      group: 'cards',
      animation: 150,
      draggable: '.card',
      handle: '.card', // koko kortti toimii kahvana
      ghostClass: 'opacity-50',
      dragClass: 'ring-2 ring-blue-400',
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd(evt) {
        const cardId = evt.item.dataset.cardId;
        const newColumnId = evt.to.parentElement.getAttribute('data-column-id');
        const newIndex = evt.newIndex;

        const newOrder = Array.from(evt.to.querySelectorAll('.card'))
          .map(el => el.dataset.cardId);

        // Täällä voit kutsua backendiäsi
        persistReorder({
          cardId,
          newColumnId,
          newIndex,
          newOrder
        });
      }
    });

    listEl.__sortableInited = true;
  });
}

async function persistReorder(payload) {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  try {
    await fetch(`http://localhost:5000/api/columns/${payload.newColumnId}/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Persist reorder failed:", err);
  }
}

// Olemassa oleva DOMContentLoaded fetch-taulun logiikkaan
document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.html';
  }

  try {
    const response = await fetch('http://localhost:5000/api/board', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    const boardData = await response.json();

    if (response.ok) {
      const board = document.getElementById('board');
      if (boardData.columns.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-board-message');
        emptyMessage.innerHTML = `<p>No columns available. Click below to add a new column.</p>`;
        board.appendChild(emptyMessage);
        document.getElementById('add-column').style.display = 'inline-block';
      } else {
        boardData.columns.forEach((column) => {
          const columnElement = document.createElement('div');
          columnElement.classList.add('column');
          columnElement.setAttribute('data-column-id', column._id);
          columnElement.innerHTML = `
            <h3>${column.name}</h3>
            <div class="cards-container" id="column-${column._id}">
              ${column.cards.map(card => `
                <div class="card" data-card-id="${card._id}">
                  <p>${card.title || 'No title'}</p>
                  <button class="bg-red-600 text-white py-1 px-2 mt-2 remove-card-btn" onclick="removeCard('${card._id}', '${column._id}')">Remove</button>
                </div>
              `).join('')}
            </div>
            <button class="bg-green-500 text-white py-1 px-2 mt-4 add-card-btn" onclick="addCard('${column._id}')">Add Card</button>
            <button class="bg-yellow-500 text-white py-1 px-2 mt-4 rename-column-btn" onclick="renameColumn('${column._id}')">Rename Column</button>
            <button class="bg-red-500 text-white py-1 px-2 mt-4 remove-column-btn" onclick="removeColumn('${column._id}')">Remove Column</button>
          `;
          board.appendChild(columnElement);
        });

        // Alustetaan DnD nyt kun DOM on rakennettu
        initDnD();
      }
    } else {
      console.error('Failed to load board data', boardData.message);
    }
  } catch (error) {
    console.error('Error fetching board data:', error);
  }
});

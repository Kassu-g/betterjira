Kanban Project
Kevyt kanban-sovellus (Node/Express + MongoDB + vanilla HTML/Tailwind + SortableJS).
Tukee kirjautumista, sarakkeita ja kortteja, drag & drop -järjestystä, hakua ja korttien värien muokkausta.
Ominaisuudet:
Auth: rekisteröinti, sisään-/uloskirjautuminen (JWT, header x-auth-token)
Oma board per käyttäjä
Sarakkeet: lisää, nimeä uudelleen, poista
Kortit: lisää, poista, vaihda väri (PATCH)
Drag & Drop:
korttien järjestys sarakkeen sisällä ja sarakkeiden välillä
sarakkeiden uudelleenjärjestys (raahaa otsikosta)
tila tallennetaan (pysyy reloadissa)
Haku/filtteri korteista
Välimuistin esto API:lle (Korttien siirtämisessä DND pieni välimuisti-ongelma mutta toimii developer toolseissa)
Mobiilituki: SortableJS

Uudet featuret:
Vaihdoin natiivin DnD:n → SortableJS 

Toteutin DND ominaisuuden:

kortit: sarakkeen sisällä ja sarakkeiden välillä

sarakkeet: raahaus otsikosta

Backend-tuki reorderille (päivittää molemmat sarakkeet yhdellä pyynnöllä)

Kortin väri (skeema + PATCH + UI)

Haku/filtteri käyttöliittymässä

Välimuistin esto: API:lle Cache-Control: no-store ja fetchissä cache:'no-store' + aikaleiman lisääminen queryyn → toimii myös ilman DevToolsia

UX-pienet parannukset: tyhjien sarakkeiden min-height, momentum-scroll mobiilissa

Rajoitteet:

Ei i18n:ää (FI/EN)

Ei testejä (Jest/supertest)

Ei rooleja (admin) tai jaettuja boardeja


Uusi piste-ennuste:

Perusrunko: ~25–28p

DnD kortit + tallennus: +4p

DnD sarakkeet + tallennus: +3p

Kortin väri (PATCH): +2p

Haku/filtteri: +3p

Välimuistin hallinta: +0.5p

Yhteensä: ~35 / 50



<!-- declaration of AI usage
Degugging frontend errors as part of the development work
A few examples of the use of the JWT token
DND feature has been implemented with help from AI

I have implemented:
Utilization of database
MongoDB. All the data needs to be stored in a database
Authentication:
Users have to have an option to register and login. You can use JWT or session based authorization
Only authenticated users can see, add or remove columns or cards
Features
Authenticated users can:
Add/remove/rename columns to/of their own board
Add cards on/of their own board. Card display in frontend has some problem but they are going to database at least.
Logout
Non-authenticated users can register and login -->




Roadmap

Inline-edit kortin otsikoille

Kommentit korteille (Comment-malli)

Testit (Jest + supertest, 8–12 testiä)

I18n (FI/EN)

Admin-näkymä / roolit



Common instructions english:

User Authentication:
Users can register and log in with their email and password.
JWT (JSON Web Token) is used for secure authentication.

Board Features:
Users can create columns for their board.
Users can add, remove, and move cards between columns.

Design:
App can be use desktop or mobile.

Technology Stack
Backend:
Node.js with Express.js for building the REST API.
MongoDB with Mongoose for database management.
Frontend:
HTML, CSS (with TailwindCSS) for building the user interface.
JavaScript for frontend logic and AJAX requests to interact with the backend.


Installation
Backend Setup
Clone this repository to your computer:
git clone <repository_url>
cd <repository_folder>
Install the required dependencies:
"npm install"
Set up your MongoDB database:
Make sure you have MongoDB running locally, or use a cloud MongoDB provider (e.g., MongoDB Atlas).
Update the connection string in the .env file:
DB_URI=mongodb://localhost:27017/jira
JWT_SECRET=your_secret_key_here

Start backend server by running 
node server.js
in server folder

Start frontend by running 
http-server
in client folder








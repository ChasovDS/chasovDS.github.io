document.addEventListener('DOMContentLoaded', function () {
    // Функции показа и скрытия секций
    function showSection(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).style.display = 'block';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('home').style.display = 'none';
        
        const searchField = document.querySelector('.input-group');
        if (sectionId === 'documentsSection') {
            searchField.style.display = 'flex';
        } else {
            searchField.style.display = 'none';
        }
    }

    function hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('home').style.display = 'block';
    }

    // Загрузка таблицы маршрута
    function loadRoute() {
        Papa.parse('assets/data/route.csv', {
            download: true,
            header: true,
            complete: function(results) {
                createRouteTable(results.data);
            },
            error: function(error) {
                console.error('Error loading CSV:', error);
            }
        });
    }

    function createRouteTable(data) {
        const tableBody = document.getElementById('routeTableBody');
        tableBody.innerHTML = '';
        data.forEach(station => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${station['Станция']}</td>
                <td>${station['Прибытие']}</td>
                <td>${station['Стоянка']}</td>
                <td>${station['Отправление']}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function loadDocuments() {
        Papa.parse('assets/data/passengers.csv', {
            download: true,
            header: true,
            complete: function(results) {
                createCards(results.data);
            },
            error: function(error) {
                console.error('Error loading CSV:', error);
            }
        });
    }

    function loadLuggage() {
        Papa.parse('assets/data/passengers.csv', {
            download: true,
            header: true,
            complete: function(results) {
                createLuggageCards(results.data);
            },
            error: function(error) {
                console.error('Error loading CSV:', error);
            }
        });
    }

    document.querySelectorAll('.nav-link, .list-group-item').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const section = event.target.getAttribute('data-section');
            showSection(section + 'Section');
            history.pushState({ section: section }, '', `#${section}`);
            if (section === 'route') {
                loadRoute();
            } else if (section === 'documents') {
                loadDocuments();
            } else if (section === 'luggage') {
                loadLuggage();
            }
        });
    });

    function createCards(data) {
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        data.forEach(person => {
            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');
            card.innerHTML = `
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <div class="card-body">
                        <h5 class="card-title">${person['Пассажир']}</h5>
                        <p class="card-text d-flex align-items-center mb-0">
                            <i class="bi bi-person-video2 fs-4 me-1"></i>
                            <span class="me-3"> <strong>${person['Документ_кр']}</strong></span> <span> ${person['Гражданство']}</span>
                        </p>  
                        <p class="card-text d-flex align-items-center mb-0">
                            <i class="bi bi-calendar-heart fs-4 me-1"></i>
                            <span class="me-5"> <strong>${person['Дата рождения']}</strong></span> <span> ${person['Пол_ск']}</span>
                        </p>                        
                        <p class="card-text d-flex align-items-center mb-0">
                            <i class="bi bi-train-front fs-4 me-1"></i>
                            
                            <span class="me-1"> <strong>${person['Вагон']}</strong></span>

                            <i class="bi bi-person-raised-hand fs-4 me-1"></i>
                            <span class="me-1"> <strong>${person['Место']}</strong></span>

                            ${person['Тип льготы'] ? `<span class="highlighted-text"> ${person['Тип льготы']}</span>` : ''}
                        </p>
                        <p class="card-text d-flex align-items-center mb-0">
                            <i class="bi bi-ticket-perforated fs-4 me-1"></i>
                            <span> ${person['Номер билета']}</span>
                        </p>        
                    </div>
                    <a href="#" class="btn btn-primary btn-details d-flex align-items-center" style="height:200px;" onclick="showDetails(event, ${JSON.stringify(person).replace(/\"/g, '&quot;')})">
                        <i class="bi bi-info-circle fs-1"></i>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function createLuggageCards(data) {
        const container = document.getElementById('luggageContainer');
        container.innerHTML = '';
        data.forEach(luggage => {
            if (luggage['Номер багажа'] && luggage['Вид отправления'] && luggage['Вид багажа']) {
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3');
                card.innerHTML = `
                    <div class="d-flex flex-row justify-content-between align-items-center">
                        <div class="card-body">
                            <h5 class="card-title">${luggage['Номер багажа']}</h5>
                            <p class="card-text">
                                ${luggage['Станция посадки']} <i class="bi bi-arrow-right"></i>  ${luggage['Станция высадки']}
                            </p>
                            <p class="card-text">${luggage['Вид багажа']}</p>
                            <p class="card-text">
                                <strong>Вагон:</strong> ${luggage['Вагон']}
                                <strong>Вес:</strong> ${luggage['Вес']} кг
                                <strong>Мест:</strong> ${luggage['Мест']}
                            </p>
                        </div>
                        <a href="#" class="btn btn-primary btn-details d-flex align-items-center" style="height:170px;" onclick="showLuggageDetails(event, ${JSON.stringify(luggage).replace(/\"/g, '&quot;')})">
                            <i class="bi bi-info-circle fs-1"></i>
                        </a>
                    </div>
                `;
                container.appendChild(card);
            }
        });
    }

    function handleSearch(event) {
        const query = event.target.value.toLowerCase();
        const cards = document.querySelectorAll('#cardsContainer .card');
        let found = false;
        cards.forEach(card => {
            const textContent = card.textContent.toLowerCase();
            if (textContent.indexOf(query) > -1) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        document.getElementById('notFoundMessage').style.display = found ? 'none' : 'block';
    }

    document.getElementById('searchInput').addEventListener('input', handleSearch);

    window.showDetails = function (event, person) {
        event.preventDefault();
        history.pushState({ view: 'details' }, '', '#details');
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        const detailsCard = document.createElement('div');
        detailsCard.classList.add('card');
        detailsCard.innerHTML = `
            <div class="card-body">
                <div class="row mb-2">
                    <div class="col-12">
                        Пассажир:<br>
                        <h6 class="card-title">${person['Пассажир']}</h6>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        Пол: <strong>${person['Пол']}</strong> Гражданство: <strong>${person['Гражданство']}</strong>
                    </div>
                </div>
                <div class="mb-2">
                    ${person['Тип паспорта']}:<br>
                    <strong>${person['Документ']}</strong><br>
                </div>
                <div class="mb-2">
                    Дата рождения:<br>
                    <strong>${person['Дата рождения']}</strong>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        Вагон: <strong>${person['Вагон']}</strong> Место: <strong>${person['Место']}</strong>
                    </div>
                </div>
                <hr>
                <div class="mb-2">
                    <strong>Номер билета:</strong><br>
                    ${person['Номер билета']}
                </div>
                <div class="mb-2">
                    <strong>Вид билета:</strong><br>
                    ${person['Тип билета']}
                </div>
                <hr>
                <div class="mb-2">
                    <strong> ${person['Вид билета']}</strong>
                </div>
                <hr>
                <div class="row mb-2">
                    <div class="col-12">
                        Поезд: <strong>${person['Поезд']}</strong> Тип вагона: <strong> ${person['Тип вагона']}</strong> Класс: <strong>${person['Класс']}</strong>
                    </div>
                </div>
                <hr>
                <div class="mb-2">
                    <strong>Постельное бельё:</strong><br>
                    Безденежно: <strong>${person['Безденежно']}</strong><br> Денежно:
                    <strong>${person['Денежно']}</strong><br>
                </div>
                <hr>
                <div class="mb-2">
                    <strong>Станция посадки:</strong><br>
                    ${person['Станция посадки']}
                </div>
                <div class="mb-2">
                    <strong>Станция высадки:</strong><br>
                    ${person['Станция высадки']}
                </div>
            </div>
        `;
        container.appendChild(detailsCard);
        document.querySelector('.input-group').style.display = 'none';
    };

    window.showLuggageDetails = function (event, luggage) {
        event.preventDefault();
        history.pushState({ view: 'details' }, '', '#details');
        const container = document.getElementById('luggageContainer');
        container.innerHTML = '';
        const detailsCard = document.createElement('div');
        detailsCard.classList.add('card');
        detailsCard.innerHTML = `
            <div class="card-body">
                <div class="row mb-2">
                    <div class="col-12">
                        <strong>Номер ЭПД:</strong> ${luggage['Номер багажа']}
                        <hr>
                    </div>
                    <div class="col-12 mb-2">
                        <strong>Вид отправления:</strong> ${luggage['Вид отправления']}<br>
                        <strong>Вид багажа:</strong> ${luggage['Вид багажа']}<br>
                        <strong>Вес (кг):</strong> ${luggage['Вес']}
                        <strong>Кол-во мест:</strong> ${luggage['Мест']}
                    </div>
                    <div class="col-12">
                        <strong>${luggage['СТАТУС ОПЛАТЫ']}</strong>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <hr>
                        <strong>Канал продаж:</strong><br>
                        ${luggage['Канал продаж']}
                        <hr>
                    </div>
                    <div class="col-12">
                        <strong>Пассажир:</strong><br> ${luggage['Пассажир']}
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <strong>Номер билета:</strong> <br>${luggage['Номер билета']}
                    </div>
                    <div class="col-12">
                        <strong>Вагон:</strong> ${luggage['Вагон']}
                        <strong>Место:</strong> ${luggage['Место']}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(detailsCard);
        document.querySelector('.input-group').style.display = 'none';
    };

    window.returnToList = function(event, listType = 'documents') {
        event && event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        if (listType === 'documents') {
            loadDocuments();
        } else if (listType === 'luggage') {
            loadLuggage();
        }
        const searchField = document.querySelector('.input-group');
        if (listType === 'documents') {
            searchField.style.display = 'flex';
        } else {
            searchField.style.display = 'none';
        }
        history.pushState(null, '', `#${listType}`);
        showSection(`${listType}Section`);
    };

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.section) {
            showSection(event.state.section + 'Section');
            if (event.state.section === 'route') {
                loadRoute();
            } else if (event.state.section === 'documents') {
                loadDocuments();
                const searchInput = document.getElementById('searchInput');
                searchInput.value = '';
                document.querySelector('.input-group').style.display = '';
            } else if (event.state.section === 'luggage') {
                loadLuggage();
            }
        } else if (event.state && event.state.view === 'details') {
            document.getElementById('mainContent').style.display = 'block';
        } else {
            showHome();
        }
    });

    const homeIcon = document.getElementById('homeIcon');
    if (homeIcon) {
        homeIcon.addEventListener('click', function () {
            showHome();
        });
    }

    function showHome() {
        hideAllSections();
        document.getElementById('home').style.display = 'block';
        document.getElementById('mainContent').style.display = 'block'; // добавлено для отображения основного контента
        history.pushState({ section: 'home' }, '', '#');
    }

    hideAllSections();
    const initialSection = location.hash.replace('#', '');

    if (initialSection) {
        showSection(initialSection + 'Section');
        if (initialSection === 'route') {
            loadRoute();
        } else if (initialSection === 'documents') {
            loadDocuments();
        } else if (initialSection === 'luggage') {
            loadLuggage();
        }
    } else {
        showHome();
    }
});
// Storage Controller
const StorageCtrl = (function() {
  // Public methods  
  return {
    storeItem: function(item) {
      let items;

      // Verificar si hay items en el localStorage
      if(localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        // Lo mandamos al localStorage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        // Lo mandamos al localStorage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;

      if(localStorage.getItem("items") === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      // Lo mandamos al localStorage
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(ID) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function(item, index) {
        if(ID === item.id) {
          items.splice(index, 1);
        }
      });

      // Lo mandamos al localStorage
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();



// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: "Bistek de Solomo", calories: 1200},
    //   // {id: 1, name: "Galleta de Soda", calories: 150},
    //   // {id: 2, name: "Huevo Frito", calories: 350}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods  
  return {
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Pasar las calorias a número
      calories = parseInt(calories);

      // Creamos el nuevo Item
      const newItem = new Item(ID, name, calories);

      // Lo añadimos al Array de items
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Asignamos el valor de las calorias totales
      data.totalCalories = total;

      return data.totalCalories;
    },
    getItemByID: function(ID) {
      let found = null;

      data.items.forEach(function(item) {
        if(item.id === ID){
          found = item;
        }
      }) ;

      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateItem: function(name, calories) {
      // Calories a número
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(ID) {
      // Obtenemos las id's
      ids = data.items.map(function(item) {
        return item.id;
      });

      // Obtenemos el index
      const index = ids.indexOf(ID);
      // Lo borramos del array
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    }
  };
})();




// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    clearAllBtn: ".clear-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  }
  
  // Public methods
  return {
    populateItemList: function(items) {
      let output = "";

      items.forEach(function(item) {
        output += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calorías</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>
        `;
      });

      // Insertamos la lista de items en el HTML
      document.querySelector(UISelectors.itemList).innerHTML = output;
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    showAlert: function(msg) {
      const container = document.querySelector(".card-content");
      const card = document.querySelector(".card");

      const div = document.createElement("div");
      div.appendChild(document.createTextNode(msg));
      div.className = "center-align";
      div.style.paddingTop = "6px";
      div.style.paddingBottom = "6px";
      div.style.background = "red";
      div.style.color = "white";

      card.insertBefore(div, container);

      setTimeout(function() {
        div.remove();
      }, 2000);
    },
    addListItem: function(newItem) {
      // Creamos el li
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${newItem.id}`;
      li.innerHTML = `
      <strong>${newItem.name}: </strong> <em>${newItem.calories} Calorías</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `;

      // Lo metemos en la lista
      document.querySelector(UISelectors.itemList).appendChild(li);

      // Mostramos la lista
      document.querySelector(UISelectors.itemList).style.display = "block";
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";

      // Limpiamos el currentItem
      ItemCtrl.setCurrentItem(null);
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Convertimos el NodeList en array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calorías</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem: function(ID) {
      const itemID = `#item-${ID}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    removeAllItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Lo volvemos array
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    }
  }
})();




// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  const loadEventListeners = function() {
    // Obtenemos los selectors del UI
    const UISelectors = UICtrl.getSelectors();

    // Eventos de los botones
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener("click", itemBackSubmit);
    document.querySelector(UISelectors.clearAllBtn).addEventListener("click", itemClearAllClick);

    // Evento del icono de editar
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // Deshabilitar hacer submit con [ENTER]
    document.addEventListener("keypress", (e) => {
      if(e.ketCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });
  };

  // Add Item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Verificamos que los campos esten llenos
    if(input.name !== "" && input.calories !== ""){
      // Añadir item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Acumulamos y mostramos las calorías totales
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      // Añadimos el item al UI List
      UICtrl.addListItem(newItem);
      // STORE en el localStorage
      StorageCtrl.storeItem(newItem);
      // Limpiamos los campos
      UICtrl.clearInputs();
    } else {
      // Saltamos una alerta
      UICtrl.showAlert("Error en los datos ingresados");
    }

    e.preventDefault();
  }

  // Update Item submit
  const itemUpdateSubmit = function(e) {
    // Obtenemos el Item a modificar
    const itemToEdit = UICtrl.getItemInput();
    // Modificamos el Item
    const updatedItem = ItemCtrl.updateItem(itemToEdit.name, itemToEdit.calories);
    // Modificamos el UI
    UICtrl.updateListItem(updatedItem);
    // Acumulamos y mostramos las calorías totales
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    // Volvemos al State principal
    UICtrl.clearEditState();
    // Updateamos el localStorage
    StorageCtrl.updateItemStorage(updatedItem);

    e.preventDefault();
  }

  // Delete Item submit
  const itemDeleteSubmit = function(e) {
    // Obtenemos el currentItem
    const currentItem = ItemCtrl.getCurrentItem();
    // Lo eliminamos de data
    ItemCtrl.deleteItem(currentItem.id);
    // Lo eliminamos del UI
    UICtrl.deleteListItem(currentItem.id);
    // Acumulamos y mostramos las calorías totales
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    // Borramos del localStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    // Volvemos al State principal
    UICtrl.clearEditState();
    // Verificamos si queda algun item para hidear la lista
    if(ItemCtrl.getItems().length === 0){
      UICtrl.hideList();
    }

    e.preventDefault();
  }

  // Clear ALL Items submit
  const itemClearAllClick = function(e) {
    // Borrar todos los items de la data
    ItemCtrl.clearAllItems();
    // Borramos todos los items del UI
    UICtrl.removeAllItems();
    // Acumulamos y mostramos las calorías totales
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    // Hideamos la lista de items
    UICtrl.hideList();
    // Borramos todos los items del Storage
    StorageCtrl.clearAllFromStorage();
  }

  // Back submit
  const itemBackSubmit = function(e) {
    UICtrl.clearEditState();
  }

  // Update Item click
  const itemEditClick = function(e) {
    if(e.target.classList.contains("edit-item")){
      // Obtenemos el item id seleccionado
      const listID = e.target.parentNode.parentNode.id;
      // Obtenemos el número del ID
      const listIDArr = listID.split("-");
      const ID = parseInt(listIDArr[1]);
      // Obtenemos el Item a editar
      const itemToEdit = ItemCtrl.getItemByID(ID);
      // Seteamos el CurrentItem
      ItemCtrl.setCurrentItem(itemToEdit);
      // Mostramos el item en los inputs
      UICtrl.addItemToForm();
      // Mostramos el Update State
      UICtrl.showEditState();

    }

    e.preventDefault();
  }
  
  // Public methods
  return {
    init: function() {
      // Seteamos el estado inicial
      UICtrl.clearEditState();

      // Obtenemos los items
      const items = ItemCtrl.getItems();

      // Verificamos si hay items para ocultar la lista
      if(items.length === 0) {
        UICtrl.hideList();
      }

      // Llenar la lista con los items
      UICtrl.populateItemList(items);

      // Acumulamos y mostramos las calorías totales
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      // Cargamos los EventListeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl, StorageCtrl);




// Initialize App
App.init();
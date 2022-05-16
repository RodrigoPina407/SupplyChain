import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = supplyChainArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        supplyChainArtifact.abi,
        deployedNetwork.address,
      );

      this.getAccount();

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  harvestItem: async function(){
    const {harvestItem} = this.meta.methods;
    const result = await harvestItem(
       $("#upc").val(), 
       this.account, 
       $("#originFarmName").val(), 
       $("#originFarmInformation").val(), 
       $("#originFarmLatitude").val(), 
       $("#originFarmLongitude").val(), 
       $("#productNotes").val(),
    ).send({from: this.account});

  $("#productID").val(result.events['Harvested'].returnValues.productId);
   this.setStatus("Status: Item Harvested with ID: " + result.events['Harvested'].returnValues.productId );

 },

 processItem: async function(){
   const {processItem} = this.meta.methods;

   const result = await processItem($("#productID").val()).send({from: this.account});

   this.setStatus("Status: Item with ID " + result.events['Processed'].returnValues.productId + " is processed");
 },

 packItem: async function(){
  const {packItem} = this.meta.methods;

  const result = await packItem($("#productID").val()).send({from: this.account});

  this.setStatus("Status: Item with ID " + result.events['Packed'].returnValues.productId + " is packed");
},

sellItem: async function(){
  const {sellItem} = this.meta.methods;

  const result = await sellItem($("#productID").val(), $("#productPrice").val()).send({from: this.account});

  this.setStatus("Status: Item with ID " + result.events['ForSale'].returnValues.productId + " is for sale");
},

buyItem: async function(){
  const {buyItem} = this.meta.methods;
  const result = await buyItem($("#productID").val()).send({from: this.account , value: $("#productPrice").val()});

  this.setStatus("Status: Item with ID " + result.events['Sold'].returnValues.productId + " is bought");
},

shipItem: async function(){
  const {shipItem} = this.meta.methods;

  const result = await shipItem($("#productID").val()).send({from: this.account});

  this.setStatus("Status: Item with ID " + result.events['Shipped'].returnValues.productId + " is shipped");
},

receiveItem: async function(){
  const {receiveItem} = this.meta.methods;

  const result = await receiveItem($("#productID").val()).send({from: this.account});

  this.setStatus("Status: Item with ID " + result.events['Received'].returnValues.productId + " is received");
},

purchaseItem: async function(){
  const {purchaseItem} = this.meta.methods;

  const result = await purchaseItem($("#productID").val()).send({from: this.account});

  this.setStatus("Status: Item with ID " + result.events['Purchased'].returnValues.productId + " is purchased");
},



 fetchItemBuffer: async function(){
  const {fetchItemBufferOne} = this.meta.methods;
  const {fetchItemBufferTwo} = this.meta.methods;

  const result1 = await fetchItemBufferOne($("#productID").val()).call();
  const result2 = await fetchItemBufferTwo($("#productID").val()).call();

  $("#sku").val(result1.itemSKU);
  $("#upc").val(result1.itemUPC);
  $("#ownerID").val(result1.ownerID);
  $("#originFarmerID").val(result1.originFarmerID);
  $("#originFarmName").val(result1.originFarmName);
  $("#originFarmInformation").val(result1.originFarmInformation);
  $("#originFarmLatitude").val(result1.originFarmLatitude);
  $("#originFarmLongitude").val(result1.originFarmLongitude);

  $("#productID").val(result2.productID);
  $("#productNotes").val(result2.productNotes);
  $("#productPrice").val(result2.productPrice);
  $("#itemState").val(result2.itemState);
  $("#distributorID").val(result2.distributorID);
  $("#retailerID").val(result2.retailerID);
  $("#consumerID").val(result2.consumerID);

},

allRoles: async function(){

  const {addAllRoles} = this.meta.methods;

  await addAllRoles($("#account").val()).send({from:this.account});

},


getAccount: async function(){

  const accounts = await ethereum.request({ method: 'eth_accounts' });
  this.account = accounts[0];
},

setStatus: function(message) {
  const status = document.getElementById("status");
  status.innerHTML = message;
},
};

window.App = App;

window.addEventListener("click", function(){

App.getAccount();

});

window.addEventListener("load",  function() {
  console.log("hello");
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});

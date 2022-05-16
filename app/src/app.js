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

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
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

    //$("#ftc-history").text(result);
    console.log('harvestItem',result);


  },

  processItem: async function(){
    const {processItem} = this.meta.methods;

    const result = await processItem($("#productID").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('processItem',result);
  },

  packItem: async function(){
      const {packItem} = this.meta.methods;
      const result = await packItem($("#productID").val()).send({from: this.account});

      //$("#ftc-history").text(result);
      console.log('processItem',result);

  },

  
  sellItem: async function(){
    const {sellItem} = this.meta.methods;
    const result = await sellItem($("#productID").val(), $("#productPrice").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('sellItem',result);

},

buyItem: async function(){
    const {buyItem} = this.meta.methods;
    const result = await buyItem($("#productID").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('buyItem',result);

},

shipItem: async function(){
    const {shipItem} = this.meta.methods;
    const result = await shipItem($("#productID").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('shipItem',result);

},

receiveItem: async function(){
    const {receiveItem} = this.meta.methods;
    const result = await receiveItem($("#productID").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('receiveItem',result);

},

purchaseItem: async function(){
    const {purchaseItem} = this.meta.methods;
    const result = await purchaseItem($("#productID").val()).send({from: this.account});

    //$("#ftc-history").text(result);
    console.log('purchaseItem',result);

},

fetchItemBufferOne: async function(){
    const {fetchItemBufferOne} = this.meta.methods;

    const result = await fetchItemBufferOne($("#productID").val()).call();

    //$("#ftc-history").text(result);
    console.log('fetchItemBufferOne',result);
},

fetchItemBufferTwo: async function(){
    const {fetchItemBufferTwo} = this.meta.methods;

    const result = await fetchItemBufferTwo($("#productID").val()).call();

    //$("#ftc-history").text(result);
    console.log('fetchItemBufferTwo',result);
},

setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.account = accounts[0];
    console.log(this.account);

} else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"),);
  }

  App.start();
});
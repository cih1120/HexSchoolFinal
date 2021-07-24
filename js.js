const apiPath = 'cih1120';
// const getProductUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/products`; //取得產品列表
// const getCartsUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts`; //取得購物車列表
// const deleteProductUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/carts/`
// const postOrder = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${apiPath}/orders`;

const getProductUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`; //取得產品列表
const getCartsUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`; //取得購物車列表
const deleteProductUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/`
const postOrder = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`;


let productData = [];
let cartData = [];

const productList = document.getElementById('productContainer');
const cartList = document.getElementById('shoppingCart-table');



//=======秀出產品列表=======
let showDataList = (productData)=>{
    productList.innerHTML = '';
    productData.forEach((item)=>{
        let li = document.createElement('li');
        li.setAttribute('class','productCard');
        let cardStr = `<h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" id="${item.id}" class="js-addCart">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">$${item.origin_price}</del>
        <p class="nowPrice">$${item.price}</p>`;
        li.innerHTML = cardStr;
        productList.appendChild(li);
    })
    selectChange();
};


//=======取得產品列表=======
let getDataList = ()=>{
    axios.get(getProductUrl)
    .then((response)=>{
        productData = response.data.products;
        showDataList(productData);
        console.log(productData);
    })
    .catch((error) => console.log(error));
}
getDataList();


//=======產生購物車列表=======
let showCartList = (cartData)=>{
    console.log('showCart');
    cartList.innerHTML ='';
    let listContent = '';
    let TTLprice = 0;
    cartData.forEach((item)=>{
        let num = item.product.price*item.quantity;
        let productLi = `<tr>
        <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.quantity*item.product.price}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons js-deleteBtn" id="${item.id}">
                clear
            </a>
        </td>
        </tr>`;
        TTLprice+=num;
        listContent += productLi;
    })
    let listTop = `<tr><th width="40%">品項</th><th width="15%">單價</th><th width="15%">數量</th><th width="15%">金額</th><th width="15%"></th></tr><tr>`;
    let listBottom = `<tr><td><a href="#" class="discardAllBtn" id="deleteCartBtn">刪除所有品項</a></td><td></td><td></td><td><p>總金額</p></td><td>NT$${TTLprice}</td></tr> `

    cartList.innerHTML = listTop+listContent+listBottom;
    addDeleteCartBtn();
    addDeleProductBtn();
}

//=======取得購物車列表=======
let getCartList = ()=>{
    axios.get(getCartsUrl)
    .then((response)=>{
        cartData = response.data.carts;
        console.log('getCartList');
        console.log(cartData);
        showCartList(cartData);
    })
    .catch((error) => console.log(error));

}
getCartList();


// =======增加購物車列表=======
let objNum = 0;
let addProduce = ()=>{
    productList.addEventListener('click',(e)=>{
        event.preventDefault();
        if(e.target.className == 'js-addCart'){
            let productId = e.target.id;
            addProductItem(productId);
            if(objNum==0){
                objNum+=1;
            }
            console.log('點擊增加購物車按鈕');
            axios.post(getCartsUrl,{
                data: {
                    "productId": productId,
                    "quantity": objNum,
                  }
              }).
                then(function (response) {
                  console.log(response.data);
                  getCartList();
                })
                objNum = 0;
        }
    })
}
addProduce();

let addProductItem = (productId)=>{
        cartData.forEach(item=>{
            if(item.product.id==productId){
                objNum = item.quantity+=1;
            }
        })
        return objNum;
}



// =======清除購物車按鈕=======
let addDeleteCartBtn = ()=>{
    let deleteCartBtn = document.getElementById('deleteCartBtn');
    deleteCartBtn.addEventListener('click',()=>{
        event.preventDefault();
        deleteAllCart();
    })
}

let deleteAllCart = ()=>{
    axios.delete(getCartsUrl).
    then(function (response) {
      console.log(response.data);
      getCartList();
    })
}


// =======清除特定品項=======
let addDeleProductBtn = ()=>{
    const shoppingCartList = document.getElementById('shoppingCart-table');
    shoppingCartList.addEventListener('click',(e)=>{
        event.preventDefault();
        if (e.target.className=='material-icons js-deleteBtn'){
            let deleteProductId = e.target.id;
            deleteProduct(deleteProductId);
        }
    })
}

let deleteProduct = (deleteProductId)=>{
    console.log(deleteProductId);
    axios.delete(deleteProductUrl+deleteProductId).
    then(function (response) {
      console.log(response.data);
      getCartList();
    })
}


//=======表格確認=======
const orderFormInput = document.querySelectorAll('.js-orderInfoinput');
const orderMessage = document.querySelectorAll('.orderInfo-message');
const orderSendBtn = document.getElementById('orderInfo-btn');

let orderInfoCheck = ()=>{
    let startOrder = false;
    orderFormInput.forEach(item=>{
        item.addEventListener('blur',(e)=>{
            startOrder = true;
            let targetId = e.target.id;
            let orderMessage = document.querySelector('.orderInfo-message[data-message='+targetId+']')
            if(e.target.value==''){
                orderMessage.classList.remove('hide');
            }else{
                orderMessage.setAttribute('class','orderInfo-message hide');
            }
        })
    })

    orderSendBtn.addEventListener('click',()=>{
        event.preventDefault();
        let correctOrder = 0;
        orderFormInput.forEach(item=>{
            if(item.value!==''){
                correctOrder += 1;
            }
        })

        if(startOrder&&correctOrder==orderFormInput.length){
            let obj = {
                'name': document.getElementById('customerName').value,
                'tel':document.getElementById('customerPhone').value,
                'email':document.getElementById('customerEmail').value,
                'address':document.getElementById('customerAddress').value,
                'payment':document.getElementById('tradeWay').value,
            }
            orderSend(obj);
            console.log('送出訂單');
        }else{
            alert('訂單資訊尚未填寫完成');
        }
    })
}

orderInfoCheck();

// =======送出訂單=======
let orderSend = (obj)=>{
   axios.post(postOrder,{
       "data":{
           "user":obj,
       }
   }).
   then((response)=>{
       console.log(response.data);
       getCartList();
       resetOrderInfo();
       alert('成功送出訂單！');
       console.log('成功送出訂單');
   })
   
}

// =======表格初始化=======
let resetOrderInfo = ()=>{
    document.querySelector('.orderInfo-form').reset();
    orderInfoCheck();
}


// =======篩選列表=======
const productSelect = document.getElementById('productSelect')
let selectChange = (data)=>{
    productSelect.addEventListener('change',(e)=>{
        console.log(e.target.value);
        let value = e.target.value;
        let valueData = productData.filter(item=>item.category==value);
        if(value=='全部'){
            showDataList(productData);
            return;
        }
        showDataList(valueData);
    })
}

selectChange();



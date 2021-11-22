window.onload = () => {

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  // калькулятор

  const aProducts = document.querySelectorAll('.product');
  let arrItems = [];

  aProducts.forEach((val, indx) => {

    const oMinus = val.querySelector('.minus');
    const oPlus = val.querySelector('.plus');

    let price = val.querySelector('.price');
    let priceVal = val.querySelector('.price').innerHTML; // цена товара
    let productSum;// цена товара с учетом количества

    let countBlock = val.querySelector('.count')

    let addProd = val.querySelector('.add-product')

    // уменьшение количества
    oMinus.onclick = function () {
      let input = this.nextElementSibling;
      let inputVal = parseInt(this.nextElementSibling.value) - 1;

      if(inputVal < 1) {
        inputVal = 1;
        productSum = priceVal;
        addProd.classList.add('not-clicked')
        addProd.classList.remove('clicked')
        countBlock.style.display = 'none';
      } else {
        inputVal = inputVal
      }
      // inputVal = inputVal < 1 ? 0 : inputVal;
      input.value = inputVal

      productSum = parseInt(priceVal) * inputVal;
      price.innerHTML = String(productSum)

      return false;
    }

    // увеличение количества
    oPlus.onclick = function () {
      let input = this.previousElementSibling;
      let inputVal = parseInt(this.previousElementSibling.value) + 1;
      inputVal = inputVal >= 0 ? inputVal : 0;
      input.value = inputVal;


      productSum = parseInt(priceVal) * inputVal;
      price.innerHTML = String(productSum);

      quantity = inputVal;
      amount = productSum;

      return false;
    }

    addProd.onclick = function () {
      this.classList.add('clicked')
      countBlock.style.display = 'block';
    }
  });

  const oPayBtn = document.querySelector('.pay');

  oPayBtn.onclick = () => {

    arrItems = [];

    aProducts.forEach((product, i) => {

      let addProd = product.querySelector('.add-product')

      let name = product.querySelector('.title').innerText;
      let description = product.querySelector('.description').innerText;
      let amount = product.querySelector('.price').innerHTML;
      let quantity = product.querySelector('input').value;
      let priceVal = product.querySelector('.price').dataset.price;

      // добавление товаров в массив

      if(addProd.classList.contains('clicked')) {
        arrItems.push(
          {
            Name: name,
            Price: parseInt(priceVal) * 100,
            Quantity: parseInt(quantity),
            Amount: parseInt(amount) * 100,
            Description: description,
            PaymentMethod: "full_prepayment",
            PaymentObject: "commodity",
            Tax: "vat10",
            Ean13: "0123456789"
          }
        )
      }
    });

    if(arrItems.length == 0) {
      alert('Добавьте товар!')
    }

    let oData = {
      Email: "a@test.ru",
      Phone: "+79031234567",
      EmailCompany: "b@test.ru",
      Taxation: "osn",
      Items: arrItems
    }

    let totalSum = 0;

    arrItems.forEach((arrItem, i) => {
      totalSum += arrItem.Amount
    });

    postData('https://securepay.tinkoff.ru/v2/Init', { TerminalKey: 'TinkoffBankTest', Amount: totalSum, OrderId: 'testId', Description: 'testDesc', Receipt: oData })
    .then((data) => {
      if(data.Success == true) {
        arrItems = [];
        window.location.href = data.PaymentURL;
      }
    });
  }
}

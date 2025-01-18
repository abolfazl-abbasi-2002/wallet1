'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abolafazl abbasi',
  movements: [200000, 45000, -40000, 30000, -65000, -130000, 700000, 130000],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'mojtaba rezaei',
  movements: [500000, 3400000, -150000, -79000, -32100, -10000, 85000, -30000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'hassan fazli',
  movements: [
    2000000, -2000000, 3400000, -30000, -200000, 500000, 4000000, -46000,
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'sara nemati',
  movements: [430000, 100000, 700000, 50000, 900000],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;

// btn login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === String(inputLoginUsername.value)
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display app
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `خوش آمدید ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear fields input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // update ui
    update(currentAccount);
  }
});

// -------------------------creat el
const creatEl = function (accc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? accc.slice().sort((a, b) => a - b) : accc;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'واریز' : 'برداشت';
    const type2 = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type2}">${type} ${
      i + 1
    }</div>
            <div class="movements__date">الان</div>
            <div class="movements__value">${mov}T</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ------------------------- balance
const calcmovbalencd = function (account) {
  account.balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `تومان ${account.balance}`;
};

// -----------------summery
const summery = function (account) {
  //
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}T`;
  //
  const deposit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${deposit}T`;
  //
  const insert = account.movements
    .filter(mov => mov > 18)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  //
  labelSumInterest.textContent = `${insert}T`;
};
// ----------------- transform
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    update(currentAccount);
  }
});

// -----------------update ui

const update = function (acc) {
  // display movements
  creatEl(acc.movements);

  // balance---------------------
  calcmovbalencd(acc);

  // summery--------------
  summery(acc);
};
// btn close
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    update(currentAccount);
  }
  inputLoanAmount.value = '';
});

// -----------------sort
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  creatEl(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// -----------------user name

const craetusername = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
craetusername(accounts);



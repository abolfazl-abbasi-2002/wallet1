'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abolfazl abbasi',
  movements: [
    2000000, 450000, -400000, 300000, -650000, -1300000, 7000000, 1300000,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-05-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2025-01-15T17:01:17.194Z',
    '2025-01-17T23:36:17.929Z',
    '2025-01-18T10:51:36.790Z',
  ],
  currency: 'EUR',
};

const account2 = {
  owner: 'mojtaba rezaei',
  movements: [
    5000000, 34000000, -1500000, -790000, -321000, -100000, 850000, -300000,
  ],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2024-07-25T18:49:59.371Z',
    '2025-01-17T12:01:20.894Z',
  ],
  currency: 'USD',
};

const account3 = {
  owner: 'hassan fazli',
  movements: [
    20000000, -20000000, 34000000, -300000, -2000000, 5000000, 4000000, -460000,
  ],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2020-01-18T21:31:17.178Z',
    '2020-10-23T07:42:02.383Z',
    '2022-09-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-08-11T17:01:17.194Z',
    '2024-08-27T23:36:17.929Z',
    '2025-01-14T10:51:36.790Z',
  ],
  currency: 'EUR',
};

const account4 = {
  owner: 'sara nemati',
  movements: [4300000, 1000000, 7000000, 500000, 9000000],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-10T10:17:24.185Z',
  ],
  currency: 'EUR',
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

console.log(...accounts);
let currentAccount, timer;

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

    // current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat('fa-IR', options).format(
      now
    );
    // update ui
    update(currentAccount);
  }
  // timer
  if (timer) clearInterval(timer);
  timer = logOutTimer();
});

// time log out
const logOutTimer = function () {
  let time = 600;
  const tick = () => {
    let min = Math.trunc(time / 60);
    let sec = time % 60;

    labelTimer.textContent = `${min.toString().padStart(2, 0)}:${sec
      .toString()
      .padStart(2, 0)}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'برای ورود به حساب خود اطلاعات را پر کنید';
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// -------------------------format date

const formatdate = function (date) {
  const calcDaysPassed = (data1, data2) =>
    Math.round(Math.abs(data2 - data1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'امروز';
  if (daysPassed === 1) return 'دیروز';
  if (daysPassed <= 7) return `${daysPassed} روز پیش`;
  return new Intl.DateTimeFormat('fa-IR').format(date);
};

// formated currency
const formatCurrency = function (value) {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
  }).format(value);
};

// -------------------------creat el

const creatEl = function (accc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = accc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: accc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach((mov, i) => {
    const { movement, movementDate } = mov;
    //  ----------------- login date
    const now = new Date(movementDate);
    const displaydate = formatdate(now);
    // mov
    const type = movement > 0 ? 'واریز' : 'برداشت';
    const type2 = movement > 0 ? 'deposit' : 'withdrawal';
    const movformated = formatCurrency(movement);
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type2}">${type} ${formatnum(
      i + 1
    )}</div>
            <div class="movements__date">${displaydate}</div>
            <div class="movements__value">${movformated}</div>
          </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ------------------------- balance
const calcmovbalencd = function (account) {
  const balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  account.balance = balance;
  const formated = formatCurrency(balance);
  labelBalance.textContent = `${formated}`;
};

// -----------------summery
const summery = function (account) {
  //
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(Math.abs(withdrawal));
  //
  const deposit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(deposit);
  //
  const insert = account.movements
    .filter(mov => mov > 18)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  //
  labelSumInterest.textContent = formatCurrency(insert);
};
// ----------------- transform
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    update(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = logOutTimer();
  }
});

// -----------------update ui

const update = function (acc) {
  // display movements
  creatEl(acc);

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

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      update(currentAccount);

      // reset timer
      clearInterval(timer);
      timer = logOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

// -----------------sort
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  creatEl(currentAccount, !sorted);
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
// // farsi

const formatnum = function (acc) {
  return Intl.NumberFormat('fa-IR').format(acc);
};

// function clock() {
//   const time = new Date();
//   let hour = time.getHours().toString().padStart(2, 0);
//   const halat = hour >= 12 ? 'PM' : 'AM';
//   const min = time.getMinutes().toString().padStart(2, 0);
//   const sec = time.getSeconds().toString().padStart(2, 0);
//   const timestring = `${hour}:${min}:${sec} ${halat}`;
//   console.log(timestring);
// }
// clock();
// setInterval(clock, 1000);

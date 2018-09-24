const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () =>{
    await page.close();
});

test('1) Header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('2) Clicking log-in button kicks in oath flow', async () =>{
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('3) When signed in, shows logout button',async () =>{
    const user = await userFactory();
    const {session, sig} = sessionFactory(user);

    // Set cookie and signature for auth
    await page.setCookie({name:'session',value:session});
    await page.setCookie({name:'session.sig', value:sig});
    await page.goto('localhost:3000');
    // Need to wait for element
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
});
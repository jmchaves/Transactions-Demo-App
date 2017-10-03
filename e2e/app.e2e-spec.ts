import { BackbaseTestAppPage } from './app.po';

describe('backbase-test-app App', () => {
  let page: BackbaseTestAppPage;

  beforeEach(() => {
    page = new BackbaseTestAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

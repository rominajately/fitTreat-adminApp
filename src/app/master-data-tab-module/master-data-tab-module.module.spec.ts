import { MasterDataTabModule } from './master-data-tab-module.module';

describe('masterDataTabModule', () => {
  let masterDataTabModule: MasterDataTabModule;

  beforeEach(() => {
    masterDataTabModule = new MasterDataTabModule();
  });

  it('should create an instance', () => {
    expect(masterDataTabModule).toBeTruthy();
  });
});

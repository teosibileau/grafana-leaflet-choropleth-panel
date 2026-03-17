import { test, expect } from '@grafana/plugin-e2e';

test.describe('Leaflet Choropleth Panel', () => {
  test('should render panel on provisioned dashboard', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
    const dashboardPage = await gotoDashboardPage(dashboard);
    await expect(dashboardPage.getPanelByTitle('Sample Choropleth').locator).toBeVisible();
  });

  test('should render leaflet container inside panel', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
    const dashboardPage = await gotoDashboardPage(dashboard);
    const panel = dashboardPage.getPanelByTitle('Sample Choropleth');
    await expect(panel.locator.locator('.leaflet-container')).toBeVisible();
  });

  test('should not display panel error', async ({ gotoDashboardPage, readProvisionedDashboard }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
    const dashboardPage = await gotoDashboardPage(dashboard);
    const panel = dashboardPage.getPanelByTitle('Sample Choropleth');
    await expect(panel.locator.locator('[data-testid="panel-status-message"]')).not.toBeVisible();
  });

  test('should show no-data message when geojson is not configured', async ({
    gotoDashboardPage,
    readProvisionedDashboard,
  }) => {
    const dashboard = await readProvisionedDashboard({ fileName: 'e2e-no-geojson.json' });
    const dashboardPage = await gotoDashboardPage(dashboard);
    const panel = dashboardPage.getPanelByTitle('Empty Choropleth');
    await expect(panel.locator).toContainText('No GeoJSON data configured');
  });
});

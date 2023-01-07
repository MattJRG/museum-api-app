import { RouterTestingModule } from '@angular/router/testing';
import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator';
import { BASE_API_ENDPOINT, GalleryService } from './gallery.service';

describe('Gallery Service', () => {
  let spectator: SpectatorHttp<GalleryService>;
  const createHttp = createHttpFactory({
    service: GalleryService,
    imports: [RouterTestingModule],
  });

  beforeEach(() => (spectator = createHttp()));

  it('should make a GET request when requesting loadMuseumDepartments', () => {
    // WHEN
    spectator.service.loadMuseumDepartments().subscribe();

    // THEN
    spectator.expectOne(`${BASE_API_ENDPOINT}/departments`, HttpMethod.GET);
  });

  it('should make a GET request when requesting loadDepartmentObjects if the object is not in the objectDictionary', () => {
    // GIVEN
    spectator.service.objectDictionary = {}
    const departmentId = 1;
    const searchQuery = 'art';

    // WHEN
    spectator.service.loadDepartmentObjects(departmentId, searchQuery).subscribe();

    // THEN
    spectator.expectOne(
      `${BASE_API_ENDPOINT}/search?departmentId=${departmentId}&q=${searchQuery}`,
      HttpMethod.GET,
    );
  });

  it('should make a GET request when requesting loadObjectDetails', () => {
    // GIVEN
    const objectId = 1;

    // WHEN
    spectator.service.loadObjectDetails(objectId).subscribe();

    // THEN
    spectator.expectOne(`${BASE_API_ENDPOINT}/objects/${objectId}`, HttpMethod.GET);
  });

  it('loadMoreDepartments should return the next departments after the number passed if more departments are available', () => {
    // GIVEN
    const currentNoOfDepartments = 5;
    spectator.service.allDepartments = [
      {departmentId: 1, displayName: '1'},
      {departmentId: 2, displayName: '2'},
      {departmentId: 3, displayName: '3'},
      {departmentId: 4, displayName: '4'},
      {departmentId: 5, displayName: '5'},
      {departmentId: 6, displayName: '6'},
      {departmentId: 7, displayName: '7'},
      {departmentId: 8, displayName: '8'},
      {departmentId: 9, displayName: '9'},
      {departmentId: 10, displayName: '10'}];

    // When
    const expected = [
      {departmentId: 6, displayName: '6'},
      {departmentId: 7, displayName: '7'},
      {departmentId: 8, displayName: '8'},
      {departmentId: 9, displayName: '9'},
      {departmentId: 10, displayName: '10'},
    ];

    // THEN
    expect(spectator.service.loadMoreDepartments(currentNoOfDepartments)).toEqual(expected);
  });

  it('loadMoreDepartments should return an empty array when argument "currentNoOfDepartments" is equal to the length of [allDepartments]', () => {
    // GIVEN
    const currentNoOfDepartments = 10;
    spectator.service.allDepartments = [
      {departmentId: 1, displayName: '1'},
      {departmentId: 2, displayName: '2'},
      {departmentId: 3, displayName: '3'},
      {departmentId: 4, displayName: '4'},
      {departmentId: 5, displayName: '5'},
      {departmentId: 6, displayName: '6'},
      {departmentId: 7, displayName: '7'},
      {departmentId: 8, displayName: '8'},
      {departmentId: 9, displayName: '9'},
      {departmentId: 10, displayName: '10'}];

    // THEN
    expect(spectator.service.loadMoreDepartments(currentNoOfDepartments)).toEqual([]);
  });
});

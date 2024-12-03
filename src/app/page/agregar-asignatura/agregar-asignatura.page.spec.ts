import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarAsignaturaPage } from './agregar-asignatura.page';

describe('AgregarAsignaturaPage', () => {
  let component: AgregarAsignaturaPage;
  let fixture: ComponentFixture<AgregarAsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

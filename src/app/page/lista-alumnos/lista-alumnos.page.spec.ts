import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAlumnosPage } from './lista-alumnos.page';

describe('ListaAlumnosPage', () => {
  let component: ListaAlumnosPage;
  let fixture: ComponentFixture<ListaAlumnosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAlumnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

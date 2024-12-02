import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturasDocentePage } from './asignaturas-docente.page';

describe('AsignaturasDocentePage', () => {
  let component: AsignaturasDocentePage;
  let fixture: ComponentFixture<AsignaturasDocentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaturasDocentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

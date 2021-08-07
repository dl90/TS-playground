import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldPopulationComponent } from './world-population.component';

describe('WorldPopulationComponent', () => {
  let component: WorldPopulationComponent;
  let fixture: ComponentFixture<WorldPopulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldPopulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldPopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

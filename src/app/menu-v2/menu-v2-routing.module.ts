import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { ModifiersComponent } from './modifiers/modifiers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { MenuTemplatesComponent } from './menu-templates/menu-templates.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { MenuTemplateDetailsComponent } from './menu-template-details/menu-template-details.component';
import { ModifiersDetailsComponent } from './modifiers-details/modifiers-details.component';
import { ModifierSecondTabDetailsComponent } from './modifier-second-tab-details/modifier-second-tab-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Parent component with menu and router-outlet
    children: [
      { path: 'menu', component: MenuComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'modifiers', component: ModifiersComponent },
      { path: 'menu-details/:menuid', component: MenuDetailsComponent },
      { path: 'menu-templates', component: MenuTemplatesComponent },
      { path: 'category-details/:catid', component: CategoryDetailsComponent },
      { path: 'category-details/:catid', component: CategoryDetailsComponent },
      { path: 'item-details/:itemid', component: ItemDetailsComponent },
      { path: 'menu-template-details', component: MenuTemplateDetailsComponent },
      { path: 'modifier-group-details/:addonid', component: ModifiersDetailsComponent },
      { path: 'modifier-details/:optionid', component: ModifierSecondTabDetailsComponent },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuV2RoutingModule { }

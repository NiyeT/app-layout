/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './recipe-detail.js';
import './recipe-list.js';
import './app-icons.js';

import {scroll} from '@polymer/app-layout/helpers/helpers.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style>
    :host {
      --paper-font-common-base: {
        font-family: Raleway, sans-serif;
      };
    }

    app-drawer-layout:not([narrow]) [drawer-toggle] {
      display: none;
    }

    .avatar-container {
      position: relative;
      border: 2px solid #00AA8D;
      border-radius: 50%;
      height: 90px;
      padding: 2px;
      width: 90px;
      margin: 20px auto;
    }

    .avatar-container .image {
      background-image: url('//app-layout-assets.appspot.com/assets/pesto/avatar.jpg');
      background-size: contain;
      border-radius: 50%;
      height: 100%;
      width: 100%;
    }

    .contact-info {
      margin: 0 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #CCC;
      text-align: center;
    }

    .contact-info .name {
      font-weight: bold;
    }

    .contact-info .email {
      color: #999;
    }

    paper-item {
      height: 54px;
    }

    paper-item > a {
      width: 100%;
      height: 100%;
      line-height: 54px;
      text-align: center;
      text-decoration: none;
      color: black;
    }

    paper-icon-button {
      --paper-icon-button-ink-color: white;
    }
    </style>

    <app-location route="{{_route}}" use-hash-as-path></app-location>
    <app-route route="{{_route}}" pattern="/:page" data="{{_pageData}}" tail="{{_subRoute}}"></app-route>
    <app-route route="{{_subRoute}}" pattern="/:id" data="{{_idData}}"></app-route>

    <app-drawer-layout responsive-width="1280px">

      <!-- nav panel -->
      <app-drawer id="drawer" swipe-open slot="drawer">
        <app-header-layout has-scrolling-region>

          <app-header fixed slot="header">
            <div class="avatar-container">
              <div class="image"></div>
            </div>
            <div class="contact-info">
              <div class="name">Jonathan</div>
              <div class="email">heyfromjonathan@gmail.com</div>
            </div>
          </app-header>

          <!-- nav menu -->
          <!-- Two way binding to the selected property has been removed due to polymer/issues/4405 -->
          <paper-listbox selected="[[_pageData.page]]" attr-for-selected="name" on-iron-activate="_drawerSelected">
            <paper-item name="home">
              <a href="#/home" name="name">Home</a>
            </paper-item>
            <paper-item name="favorites">
              <a href="#/favorites" name="name">Favorites</a>
            </paper-item>
            <paper-item name="saved">
              <a href="#/saved" name="name">Saved</a>
            </paper-item>
            <paper-item name="trending">
              <a href="#/trending" name="name">Trending</a>
            </paper-item>
          </paper-listbox>
        </app-header-layout>
      </app-drawer>

      <!-- list/detail pages -->
      <iron-pages selected="[[_selectedPage]]" attr-for-selected="name">

        <recipe-list name="home" recipes="[[recipes]]">
          <paper-icon-button icon="app:menu" drawer-toggle slot="drawer-toggle"></paper-icon-button>
        </recipe-list>

        <recipe-list name="favorites">
          <paper-icon-button icon="app:menu" drawer-toggle slot="drawer-toggle"></paper-icon-button>
        </recipe-list>

        <recipe-list name="saved">
          <paper-icon-button icon="app:menu" drawer-toggle slot="drawer-toggle"></paper-icon-button>
        </recipe-list>

        <recipe-list name="trending">
          <paper-icon-button icon="app:menu" drawer-toggle slot="drawer-toggle"></paper-icon-button>
        </recipe-list>

        <recipe-detail id="detailView" name="detail" recipe="[[_getRecipe(recipes, _idData.id)]]"></recipe-detail>

      </iron-pages>

    </app-drawer-layout>
`,

  is: 'recipe-app',

  properties: {

    recipes: Object,

    _route: Object,

    _subRoute: Object,

    _pageData: {type: Object, observer: '_pageDataChanged'},

    _selectedPage: String,

    _idData: Object,

    _scrollPositionMap: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },

  attached: function() {
    this.async(function() {
      if (!this._route.path) {
        this.set('_route.path', '/home');
      }
    });
  },

  _getRecipe: function() {
    if (this.recipes && this._idData && this._idData.id) {
      for (var i = 0; i < this.recipes.length; ++i) {
        var r = this.recipes[i];
        if (r.id === this._idData.id) {
          return r;
        }
      }
    }
    return null;
  },

  _drawerSelected: function() {
    if (!this.$.drawer.persistent)
      this.$.drawer.close();
  },

  /**
   * Preserves the document scroll position, so
   * it can be restored when returning to a page.
   */
  _pageDataChanged: function(pageData, oldPageData) {
    var map = this._scrollPositionMap;

    if (oldPageData != null && oldPageData.page != null) {
      map[oldPageData.page] = window.pageYOffset;
    }
    this._selectedPage = pageData.page;
    if (map[pageData.page] != null) {
      scroll({top: map[pageData.page], behavior: 'silent'});
    } else if (this.isAttached) {
      scroll({top: 0, behavior: 'silent'});
    }
  }
});

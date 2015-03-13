"use strict";angular.module("samsungEnterpriseApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ui.router","gsDirectives","ui.keypress","ngTouch","ngTell","angularMoment"]).constant("AppConfig",{backend:{enabled:!1}}).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){a.state("login",{url:"/",templateUrl:"/views/start/login.html",controller:"LoginCtrl"}).state("menu",{url:"/menu",templateUrl:"/views/start/menu-screen.html",controller:"MenuScreenCtrl"}).state("expense",{url:"/expense",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@expense":{templateUrl:"/views/default/header.html",controller:"HeaderExpenseCtrl"}}}).state("expense.basic",{url:"/basic",views:{"Content@expense":{templateUrl:"/views/expense/expense-home.html",controller:"ExpenseHomeCtrl"}}}).state("expense.add",{url:"/add",views:{"Content@expense":{templateUrl:"/views/expense/add-expense.html",controller:"AddExpenseCtrl"}}}).state("expense.view",{url:"/view",views:{"Content@expense":{templateUrl:"/views/expense/view-expense.html",controller:"ViewExpenseCtrl"}}}).state("expense.view.details",{url:"/:id",views:{"Content@expense":{templateUrl:"/views/expense/expense-details.html",controller:"ExpenseDetailsCtrl"}}}).state("contact",{url:"/contact",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@contact":{templateUrl:"/views/default/header.html",controller:"HeaderContactCtrl"}}}).state("contact.entries",{url:"/entries",views:{"Content@contact":{templateUrl:"/views/contact/contact-entries.html",controller:"ContactEntriesCtrl"}}}).state("contact.entries.details",{url:"/:id",views:{"Content@contact":{templateUrl:"/views/contact/contact-details.html",controller:"ContactDetailsCtrl"}}}).state("password",{url:"/password",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@password":{templateUrl:"/views/default/header.html",controller:"HeaderPasswordCtrl"}}}).state("password.entries",{url:"/entries",views:{"Content@password":{templateUrl:"/views/password/password-entries.html",controller:"PasswordEntriesCtrl"},"SlideOutMenu@password":{templateUrl:"/views/password/add-password.html",controller:"AddPasswordCtrl"}}}).state("calendar",{url:"/calendar",views:{"@":{templateUrl:"/views/default/app-structure.html"},"Header@calendar":{templateUrl:"/views/default/header.html",controller:"HeaderCalendarCtrl"}}}).state("calendar.basic",{url:"/basic",views:{"Content@calendar":{templateUrl:"/views/calendar/calendar-home.html",controller:"CalendarHomeCtrl"}}}).state("calendar.events",{url:"/events",views:{"Content@calendar":{templateUrl:"/views/calendar/calendar-events.html",controller:"CalendarEventsCtrl"}}}).state("calendar.timezone",{url:"/timezone",views:{"Content@calendar":{templateUrl:"/views/calendar/timezone.html",controller:"CalendarTimezoneCtrl"}}}),b.otherwise("/menu"),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|tel|file|ftp|blob|mailto|content|javascript):/)}]).run(["$state","$stateParams","dictionary","slideOutMenuParams","gsDeviceListeners","AppEventManager","$Tell","$timeout","$rootScope",function(a,b,c,d,e,f,g,h,i){i.$state=a,i.$stateParams=b,i.dictionary=c.read(),i.slideOutMenuParams=d,e.init(),i.blur=function(a){return g.children("App Holder",f.blur),a&&"function"==typeof a&&h(a,50),!0},i.$on("$device.backbutton",function(a){i.blur(),d.isSlideOpen&&(a.preventDefault(),a.defaultPrevented=!0,d.close(),i.$apply())}),i.noop=function(){i.$emit("$alert",{message:"Feature currently unavailable",showTime:3e3})}}]),angular.module("samsungEnterpriseApp").controller("LoginCtrl",["$scope","$state","$timeout","utilityService","$rootScope",function(a,b,c,d,e){a.credentials={username:null,password:null},a.login=function(d){return a.error=!1,a.credentials.username&&a.credentials.username.toLowerCase().indexOf("samsung")>-1?(d&&d.target.blur(),c(function(){e.$emit("$alert",{message:"logging in",showtime:200}),c(function(){e.$emit("$alertCancel"),b.go("menu")},400)},300),!0):(a.error=!0,!1)},c(function(){a.line={first:"The Next Big",second:"Thing Is Here"}},1e3),a.$on("$device.backbutton",function(a){a.defaultPrevented||navigator.app&&navigator.app.exitApp()})}]),angular.module("samsungEnterpriseApp").controller("MenuScreenCtrl",["$scope","$state","$timeout",function(a,b,c){a.menus=[],a.select=function(d){a.selected=!0,c(function(){b.go(d)},300)},c(function(){a.loaded=!0},300),a.$on("$device.backbutton",function(a){a.defaultPrevented||navigator.app&&navigator.app.exitApp()})}]),angular.module("samsungEnterpriseApp").factory("dictionary",function(){var a={login:{error:"Please login with your Samsung id"},expense:{header:{title:"Expense Management"},add:{error:"Please enter the required fields to save the receipt"}},contact:{header:{title:"Contact Management"}},password:{header:{title:"Password Vault"},master:{error:"Please enter the master password to open the vault"},add:{title:{error:"Please enter a title for password field"},password:{error:"The password and retype password did not match or empty"}}},calendar:{header:{title:"Enterprise Calendar"}},camera:{unavailable:"Camera plugin unavailable"}};return{read:function(){return a}}}),angular.module("samsungEnterpriseApp").controller("PasswordEntriesCtrl",["$scope","passwordManagerService","AppEventManager","$state","utilityService",function(a,b,c,d,e){a.displayPassword=!1,a.check=function(c){a.error={},a.masterPassword?(c&&c.target.blur(),a.displayPassword=!0,b.get().then(function(b){a.passwordList=b})):a.error.master=!0},a.$on(c.password.added,function(c,d){d.password&&(a.passwordList=b.add(d.password))}),a.$on("$device.backbutton",function(a){a.defaultPrevented||d.go("menu")}),e.animateForData(function(){a.loaded=!0,a.masterPassword=null})}]),angular.module("samsungEnterpriseApp").factory("networkCallService",["AppConfig","$http","$q",function(a,b,c){function d(d){var e=c.defer(),f={},g={contacts:"internal-contacts",password:"password-list",events:"calendar-events",timezone:"calendar-timezone",expenses:"expense-list"};return!a.backend.enabled&&g[d]?f[d]?e.resolve(f[d]):b.get("./mock-data/"+g[d]+".json").success(function(a){e.resolve(a),f[d]=a}).error(function(a){e.reject(a)}):(e.reject("call rejected"),console.log("Network call rejected")),e.promise}return{call:function(a){return d(a)}}}]),angular.module("samsungEnterpriseApp").factory("passwordManagerService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("password").then(function(a){c=a.passwordList,d.resolve(c)}),d.promise},add:function(a){return c.push({title:a.title,password:a.password,id:a.id}),c}}}]),angular.module("samsungEnterpriseApp").filter("maskPassword",function(){return function(a,b){return b?"xxxxxx"+a.slice(-2):a}}),angular.module("samsungEnterpriseApp").factory("contactManagerService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("contacts").then(function(a){c=a.contacts,d.resolve(c)}),d.promise}}}]),angular.module("samsungEnterpriseApp").controller("ContactEntriesCtrl",["$scope","contactManagerService","$state","utilityService",function(a,b,c,d){a.isLoading=!0,d.alert(),b.get().then(function(b){d.animateForData(function(){d.stopAlert(),a.isLoading=!1,a.contacts=b},function(){d.stopAlert(),a.isLoading=!1})}),a.$on("$device.backbutton",function(a){a.defaultPrevented||c.go("menu")})}]),angular.module("samsungEnterpriseApp").directive("contactItem",function(){return{templateUrl:"/views/directives/contact-item.html",restrict:"E",replace:!0,scope:{contact:"="}}}),angular.module("samsungEnterpriseApp").directive("wallopSlider",function(){return{template:'<div ng-swipe-left="onNextButtonClicked()" ng-swipe-right="onPrevButtonClicked()" class="wallop-slider {{animationClass}}"><ul class="wallop-slider__list"><li class="wallop-slider__item {{itemClasses[$index]}}" ng-repeat="i in images"><img src="{{i}}"></li></ul></div>',restrict:"EA",transclude:!0,replace:!1,scope:{images:"=",animation:"@",currentItemIndex:"=",onNext:"&",onPrevious:"&"},controller:["$scope",function(a){function b(){return console.log("$scope.currentItemIndex",a.currentItemIndex,a.images.length),a.currentItemIndex+1===a.images.length}function c(){return!a.currentItemIndex}function d(){a.nextDisabled=b(),a.prevDisabled=c()}function e(){for(var b=0;b<a.images.length;b++)a.itemClasses[b]=""}function f(b){if(console.log("_goTo",b),b>=a.images.length||0>b||b===a.currentItemIndex)return void(b||(a.itemClasses[0]=g.currentItemClass));e(),a.itemClasses[a.currentItemIndex]=b>a.currentItemIndex?g.hidePreviousClass:g.hideNextClass;var c=b>a.currentItemIndex?g.showNextClass:g.showPreviousClass;a.itemClasses[b]=g.currentItemClass+" "+c,a.currentItemIndex=b,d()}a.itemClasses=[],a.$watch("images",function(a){a.length&&f(0)}),a.$watch("itemClasses",function(a){console.log("itemClasses",a)}),a.animation&&(a.animationClass="wallop-slider--"+a.animation);var g={btnPreviousClass:"wallop-slider__btn--previous",btnNextClass:"wallop-slider__btn--next",itemClass:"wallop-slider__item",currentItemClass:"wallop-slider__item--current",showPreviousClass:"wallop-slider__item--show-previous",showNextClass:"wallop-slider__item--show-next",hidePreviousClass:"wallop-slider__item--hide-previous",hideNextClass:"wallop-slider__item--hide-next"};a.onPrevButtonClicked=function(){f(a.currentItemIndex-1)},a.onNextButtonClicked=function(){f(a.currentItemIndex+1)},a.$watch("currentItemIndex",function(b,c){c>b?"function"==typeof a.onPrevious&&a.onPrevious():"function"==typeof a.onNext&&a.onNext()})}]}}),angular.module("samsungEnterpriseApp").controller("AddPasswordCtrl",["$scope","AppEventManager","$Tell",function(a,b,c){a.password={},a.add=function(d){return a.error={},d&&d.target.blur(),a.password.password&&a.password.title&&a.password.password===a.password.rePassword?(a.password.id=(new Date).getTime(),c.children("Password Block",b.password.added,{password:a.password}),a.password={},!0):a.password.title?(a.error.password=!0,!1):(a.error.title=!0,!1)}}]),angular.module("samsungEnterpriseApp").factory("AppEventManager",function(){return{password:{added:"event.password.added"},blur:"event.blur.fields"}}),angular.module("samsungEnterpriseApp").controller("HeaderContactCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){return b.is("contact.entries.details")?void b.go("contact.entries"):void b.go("menu")},a.title=c.dictionary.contact.header.title}]),angular.module("samsungEnterpriseApp").controller("HeaderPasswordCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){b.go("menu")},a.title=c.dictionary.password.header.title}]),angular.module("samsungEnterpriseApp").controller("CalendarHomeCtrl",["$scope","$state","utilityService",function(a,b,c){a.options=[],c.animateForData(function(){a.options=[{labelTop:"Calendar",labelBottom:"Events",icon:"calendar",state:"calendar.events"},{labelTop:"Headquarters",labelBottom:"Timezone",icon:"globe",state:"calendar.timezone"}]}),a.$on("$device.backbutton",function(a){a.defaultPrevented||b.go("menu")})}]),angular.module("samsungEnterpriseApp").controller("HeaderCalendarCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){switch(!0){case b.is("calendar.basic"):b.go("menu");break;default:b.go("calendar.basic")}},a.title=c.dictionary.calendar.header.title}]),angular.module("samsungEnterpriseApp").factory("calendarEventService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("events").then(function(a){c=a.events,d.resolve(c)}),d.promise}}}]),angular.module("samsungEnterpriseApp").controller("CalendarEventsCtrl",["$scope","calendarEventService","$state","utilityService",function(a,b,c,d){b.get().then(function(b){d.animateForData(function(){a.events=b})}),a.$on("$device.backbutton",function(a){if(!a.defaultPrevented)switch(!0){case c.is("calendar.basic"):c.go("menu");break;default:c.go("calendar.basic")}})}]),angular.module("samsungEnterpriseApp").controller("CalendarTimezoneCtrl",["$scope","calendarTimezoneService","$state","utilityService",function(a,b,c,d){b.get().then(function(b){d.animateForData(function(){a.timezones=b})}),a.$on("$device.backbutton",function(a){if(!a.defaultPrevented)switch(!0){case c.is("calendar.basic"):c.go("menu");break;default:c.go("calendar.basic")}})}]),angular.module("samsungEnterpriseApp").factory("calendarTimezoneService",["networkCallService","$q",function(a,b){var c;return{get:function(){var d=b.defer();return c?d.resolve(c):a.call("timezone").then(function(a){c=a.timezone,d.resolve(c)}),d.promise}}}]),angular.module("samsungEnterpriseApp").controller("ContactDetailsCtrl",["$scope","contactManagerService","$state","$stateParams","utilityService",function(a,b,c,d,e){b.get().then(function(b){e.animateForData(function(){for(var c=b,e=parseInt(d.id),f=0;f<c.length;f+=1)if(c[f].id===e){a.contact=c[f];break}})}),a.$on("$device.backbutton",function(a){a.defaultPrevented||c.go("contact.entries")})}]),angular.module("samsungEnterpriseApp").filter("timezoneFilter",["moment",function(a){return function(b){var c=a().utc();return c=c.utcOffset(b),{time:c.format("h:mm A"),date:c.format("MMM DD")}}}]),angular.module("samsungEnterpriseApp").factory("utilityService",["$timeout","$rootScope",function(a,b){var c=300;return{animateForData:function(b){return a(b,c)},alert:function(a){a=a||"loading...",b.$emit("$alert",{message:a})},stopAlert:function(){b.$emit("$alertCancel")}}}]),angular.module("samsungEnterpriseApp").controller("ExpenseHomeCtrl",["$scope","$state","utilityService",function(a,b,c){a.options=[],c.animateForData(function(){a.options=[{labelTop:"Add",labelBottom:"Expense",icon:"plus",state:"expense.add"},{labelTop:"View",labelBottom:"Expense",icon:"table",state:"expense.view"}]}),a.$on("$device.backbutton",function(a){if(!a.defaultPrevented)switch(!0){case b.is("expense.basic"):b.go("menu");break;default:b.go("expense.basic")}})}]),angular.module("samsungEnterpriseApp").controller("HeaderExpenseCtrl",["$scope","$state","$rootScope",function(a,b,c){a.back=function(){switch(!0){case b.is("expense.basic"):b.go("menu");break;case b.is("expense.view.details"):b.go("expense.view");break;default:b.go("expense.basic")}},a.title=c.dictionary.expense.header.title}]),angular.module("samsungEnterpriseApp").controller("AddExpenseCtrl",["$scope","cameraService","expenseManagerService","$state","$rootScope",function(a,b,c,d,e){function f(c){switch(!0){case c.type===b.TYPE.FILE:a.billImage=c.uri;break;case c.type===b.TYPE.DATA:a.billImage="data:image/png;base64,"+c.uri}}function g(a){e.$emit("$alert",{message:a,showTime:2e3})}a.defaultDate=new Date,a.expense={},a.capture=function(){b.capture().then(f,g)},a.gallery=function(){b.gallery().then(f,g())},a.saveExpense=function(b){return b&&b.target.blur(),a.error=!1,a.expense.amount&&a.expense.category&&a.expense.date?(a.expense.image=a.billImage,c.add(a.expense).then(function(){d.go("expense.view")}),!0):(a.error=!0,!1)},a.$on("$device.backbutton",function(a){a.defaultPrevented||d.go("expense.basic")})}]),angular.module("samsungEnterpriseApp").controller("ViewExpenseCtrl",["$scope","expenseManagerService","$state","utilityService",function(a,b,c,d){a.expenses=[],a.isLoading=!0,b.get().then(function(b){d.animateForData(function(){a.isLoading=!1,a.expenses=b},function(){a.isLoading=!1})}),a.$on("$device.backbutton",function(a){a.defaultPrevented||c.go("menu")})}]),angular.module("samsungEnterpriseApp").factory("cameraService",["$q",function(a){function b(b){var c=a.defer();return window.navigator&&navigator.camera?(b=b||{quality:100,destinationType:Camera.DestinationType.FILE_URI,sourceType:Camera.PictureSourceType.CAMERA,allowEdit:!0,encodingType:Camera.EncodingType.PNG,popoverOptions:null,saveToPhotoAlbum:!1,correctOrientation:!1,targetWidth:800,targetHeight:800},navigator.camera.getPicture(function(a){c.resolve({type:cameraService.FILE,uri:a})},function(a){c.reject(a)},b),c.promise):(c.resolve("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"),c.promise)}function c(b){var c=a.defer();return window.navigator&&navigator.camera?(b=b||{quality:100,destinationType:Camera.DestinationType.DATA_URL,sourceType:Camera.PictureSourceType.PHOTOLIBRARY},navigator.camera.getPicture(function(a){c.resolve({type:cameraService.DATA,uri:a})},function(a){c.reject(a)},b),c.promise):(c.resolve("iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAMJklEQVR4Xu2c4XYjuQoGx+//0NkTT07Ga3dbohqw2q77N0JCHxTQ8uy9fH19ff3xfyqgApsKXATEzFCBfQUExOxQgScKCIjpoQICYg6oAFPADsJ00+pDFBCQDwm012QKCAjTTasPUUBAPiTQXpMpICBMN60+RAEB+ZBAe02mgIAw3bT6EAXCgFwul9NL8+yfn3Xfr8KXin9e161LRZIRXQTkLhLdiSAgFShs7ykgk1pXJOXk0Q/LKnwhiTDyv7twjPwhfye62EHsIFO5JiBTMv358+5Cdd/PDjKZeAnL7CCTIlYk5eTRjlhUqAQ7AZkUUUAmhbpZ1t1Z4x6OLV4OCHFgfC224llAu/2kydXt5zOlV9Kz08/Uj3QDuh06AWFFjlhlgywgJApBGwEJCnZguYBMipct1OSxm8sE5Ih6MdvsuNtBYvqj1QKCZENGAjIpW7ZQk8faQY4IlWCbHXc7SEJQRlvYQUYK5f39tIDQJHkmHf09g762UfEr7KguNBW770DvR/3cO6+tgwjIdggo5DSBBCSmgIAE9KLVqcJOQLYVoFrbQW4UcMQKVIWfpTTxzj452EECuVKRJI5YgQD8LKWakcIoIIH4CEjfdxQdIWmMHLEcsQKl4HEpTTxHrMnEO7tQo+yi96Pjwsgf8nfqC7UjPn7b0PMcsW4UpxWPBk1A4q9KVGsBmVSuU6iRSwIiIFcFaGWmCbTKx5qA7P//odFCNdJ07+/0PEcsRyyac1e7isQ7e2H0mfdQSv0zpolAkzLJ7f9tQ32hdvQO9Dw7iB2E5pwdZEc5O8ihlDreQZKOf2knoBWd3p2eZwc5YQehSdL9ePGpjzN2kKQMpd8gScfbQX4UoCDvxUFAkjJUQLaFrNDFEWsyaTuFGrlUkQijMzt/J6CVuUKXzrjbQWgW3tlVJAJ1rSKBBGQyGp8q1EgeAXHEuipAARklWPbfK/yke1bY0VcsqjO9Az2P2mX72TZi0QtTu2yhjhQH6gvtSuS9f6QzvcNo3+y/Z/spIIEIUfEr7Owg8ZGOFA4BEZApBSjkU5snLsr2U0ACwaHiV9jZQewggdR9XEqT8tmhdM8KOwEREAG57P9HSgJyQkAOZXSj8Vl+SDuLn42hO3TUyz/SD3nfaHyWxDuLn42hO3SUgEzKd5bEO4ufk7K/fJmATIbgLIl3Fj8nZX/5MgGZDMFZEu8sfk7K/vJlAjIZgrMk3ln8nJT95csEZDIEZ0m8s/g5KfvLl7UA8vJbFjvQ/Q8E6Xn0dxD6o2Wx7MtuH/6nJsveJMkxmrCkOn27TM8TkKSAD7YRkDuBaMIKSE/Cdp8iIALyqwCFvDtpO88TEAERkCfECYiACIiAzDdlv0HmtfqEleEOUpFA3XvSWbviiZTuWaHZs4SnfnZDlO2ngAQimC3+6JmX/lBIn4AF5FEBARGQKQUqisPUwcFF2X4KSCAA2eLbQQLiTy7NjpGATAp/JJkrRhe/QbZVFZAbXeiM7kd6oCr8LM1OvLgHcxbZftpB5nS/rsoW/8iedpAP6iCBHF12aQU8dDSjr1j0DhTWimDS6WDPlyU6SIVQ3XvS5KJ+0qSsGEupL/TutACQ8wSEqLZhIyBJQh7cxg5yUMAqcwGpUja2r4DE9GpbLSBtUj89SEDWiMODFwKyRmAEZI04CMiNAn6kJyQlFZFWhIrzKroE9TMhJA9b0Bcu+qrUrSfJpfArFg0MTQRyqW8fK87rDijVmtoJyKNyAnKnCU2SbpApBBXVvmLPCj3JngIiIL8K0OIgIAnlqmLkeeZWxXmOWPFEoNCRaj8arcmedhA7iB3kCfcCIiACsgIg8eb816JirKGjGWnR9N4jOzpC0u+FCs0q7pB9v7YOMgr43t8FZFuZiuSiBYDGqOIOAnKjAA1oRTWkBYDaVSQX1VNAaBQT7Kj49Oju8yr8pHsKyKNyjlh3mghIHC+qWUUXdMRyxBo+XsRT/K+FHcQOMswdWg2HGycvqKi+AlIMCA1axa+tFYm+0v0qHhoq7pdcF4bbZcc99RukQmB6YWpHE4/Ovt1+0mJE7zfM6OQF2XoKSCBAKxUACrKABAL+/UP1Fx08N85ZKYGyK8n3dVe6n4BsK5AddwEJFBQB2RYrscYGoiEgw+dMOi7QgAqIgBwieKUEym61jlj7qUELzqFk2zHOjnt4xKIOULuKWZsG5iwFgN6vItHPHncBCWSTgATE+lkqIDearfRN0F0N6e8ENIEorNTPOBp/Lej9Vpkc7CCByNOkrCgc1BcBCQSc/A5CKwK1W6WSjKohTTyqi4D0vKjZQQIFhSalHSQ3mWlRCYT6d6mABFQTkIBYfqTHxSIWtPquNPK8+4MBHYNJPhyxIXFI7SBHnN+zFZBtZVbqZgJyowANDIVHQASE5s69nR1kUkkKXYXdpMsPy2ih6r4D9ZPqQkfrPTtHrDtl6AsJtaOJQBNPQGKKC4iA/HvSvFx2s4eMJ9+bUZBjaTy3mtxBQAREQJ7wlQoIbd90bqRjDbWbq1OPq7rPo35SO9olaL5U2LV8g1DHBYSm5hp2AjL5zCsg8SdZMhevgcU/LwREQA7lpCPWtny0oFbYOWIlQE4pERABuSpAyfYbhKK3hp0jVkL1fWcRR2lqB7GDHOog9EO1Gzra6Z7ZVdyh4rxRESB/7544iI9L/A4iIPHQdWsW93BsISAJo1lFNVwpMHaQ+NN4RSdf+hWruxoKyLi6d6xYKQ4CcqPASoGxg9hBrgpUvORUJFfFnt1jYsV5FR1lpUJlB7GDDAtVBQT0e6G7UKUB0i1i93k0MGdJhIpOTjtWxbcn3VNAJkkTkEmhJpdVAFmxp4AkBHRyi4dlK83ancn1im9POwjN0kk7O8ikUJPLKoCs2NMOkhDQyS3sIDcKVCRzxZ4CMpnddpBJoSaXVSRzxZ4CkhDQyS3sIJ/cQSoqLE08apf9ITf6GK14AqZ3oNW3wo7q8syO+pnWQQRkW0qqC33hEpB4HIhmqf/cnVb0bjsi1MhHAYknrB1klFUv+ruAbAtf0c0qCocjVjE4AiIgsynmiDWr1GBdRaXM/uAcPSbYQR6DLCAC8quAgBQDUjG60PytqL509qV3oB+xFd2M3qE7DtTPlmdeAckOz/5+tNpT6OjNBORGOQGhaRS3E5C4ZsQi9RtEQEgImI2AMN2iVgISVWxnPZ376fECQpWL2QlITK/d1QKyLY3fIH6DXBUQEAEZJkJF26evLrRy0UQ/y/dXUsMs32YVPdtGLJp4AhLPxQqt414csxCQY/pdrWnHonYU1oSrhrYQkJBcTxfbQe7kocm1SsV7xfdQXjr+22kVPQVEQCry+/CeAnJYQkesPQlpF0wISdoWApIgJf2WoHZ+gyQEbXILAZkUiiZlxTNvN1jv3gkqYkTzZbcbfwVR7b4UvXCFnwISr2pUM2pH80VAbhSg4lM7GjQ7yLZyVJdgL7ge7itW4BVLQOwgQwUqRpfhoTsLaMJ229lB4p2Axohq7YjliEXr0CE7mujUTkBemOjdQaOz9qGMTjammlE7ASkG5JnAFQlLE6HCjrJBdaF3oH76kX6jHP1WEpB4+glIQuJREWnLFJBt5UgVHSFDY2sHmQRrFIC9v1OBaZLQROiGvKI4VHRWGr+KfPEVa/LbpSIRBCTezbqLkYAIyFUB2j0rCocdxBFrOA3QJKmwGzq7s4BWe3oH6icpDm3/1IReitrROZza0QpLgvZ9VrefNA4V4yX1hWgtIHdqdyceCZqAMESI1gIiIL8K0FGJpSv/L0Irznv5Rzq9FLWjnYDaOWLFI+U3SFyzNAua6NROQOKhE5C4ZmkWNNGpnYDEQycgcc3SLGiiUzsBiYfu4wCJS/QaCxoYakefOivUqSgA1M8KX7L3TH3FokJ129FEp3YCsq1AdjJXPH8LSNIzL30iJW/zRwpKRVJSfyp8yd5TQATkV4F3gFVAaLm6saOjErVzxHLESkjbvi1oolM7ARGQvuxOOIkmOrUTkA8CJCE/3UIFTqNA+CP9NDfTURVIUEBAEkR0i/dVQEDeN7beLEEBAUkQ0S3eVwEBed/YerMEBQQkQUS3eF8FBOR9Y+vNEhQQkAQR3eJ9FRCQ942tN0tQQEASRHSL91VAQN43tt4sQQEBSRDRLd5Xgf8ALqWnmQhIyp8AAAAASUVORK5CYII="),c.promise)}var d={DATA:0,FILE:1};return{capture:b,gallery:c,TYPE:d}}]),angular.module("samsungEnterpriseApp").factory("expenseManagerService",["networkCallService","$q",function(a,b){function c(){var c=b.defer();return f?c.resolve(f):a.call("expenses").then(function(a){f=a.expenses,c.resolve(f)}),c.promise}function d(a){for(var c=b.defer(),d=0;d<f.length;d+=1)if(f[d].id===a){c.resolve(f[d]);break}return c.promise}function e(a){function d(){f.push({id:(new Date).getTime(),amount:"$"+a.amount,value:a.amount,currency:"$",type:a.category,notes:a.notes,date:a.date.getTime(),image:a.image})}var e=b.defer();return f?(d(),e.resolve()):c().then(function(){d(),e.resolve()}),e.promise}var f;return{add:e,get:c,find:d}}]),angular.module("samsungEnterpriseApp").directive("expenseItem",function(){return{templateUrl:"/views/directives/expense-item.html",restrict:"E",replace:!0,scope:{expense:"="}}}),angular.module("samsungEnterpriseApp").filter("phoneFilter",function(){return function(a){if(!a)return"";var b=a.toString().trim().replace(/^\+/,"");if(b.match(/[^0-9]/))return a;var c,d,e;switch(b.length){case 10:c=1,d=b.slice(0,3),e=b.slice(3);break;case 11:c=b[0],d=b.slice(1,4),e=b.slice(4);break;case 12:c=b.slice(0,3),d=b.slice(3,5),e=b.slice(5);break;default:return a}return 1==c&&(c=""),e=e.slice(0,3)+"-"+e.slice(3),(c+" ("+d+") "+e).trim()}}),angular.module("samsungEnterpriseApp").controller("ExpenseDetailsCtrl",["$scope","expenseManagerService","$state","$stateParams","utilityService",function(a,b,c,d,e){var f=parseInt(d.id);b.find(f).then(function(b){e.animateForData(function(){a.expense=b})}),a.$on("$device.backbutton",function(a){a.defaultPrevented||c.go("expense.entries")})}]),angular.module("samsungEnterpriseApp").directive("blur",["AppEventManager",function(a){return{restrict:"A",link:function(b,c){b.$on(a.blur,function(){c[0].blur()})}}}]),angular.module("samsungEnterpriseApp").filter("totalExpense",function(){return function(a,b){if(a&&b){for(var c=0,d=0;a&&a.length&&d<a.length;d+=1)a[d][b]&&(c+=parseFloat(a[d][b]));return c}}});
/**
 * @license
 * 
 * Copyright 2017 Geoffrey Mattie
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

//Imports
import Controller from "./application/Controller.js";

/**
 * @description The <strong>main.js</strong> module is the entry point to the application.
 * @requires App
 * @module
 * 
 */

const controller = new Controller();
controller.init();
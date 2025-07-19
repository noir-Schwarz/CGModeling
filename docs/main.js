/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
//23FI060 髙橋由麻



class ThreeJSContainer {
    scene;
    light;
    camera;
    renderer;
    controls;
    world;
    followTarget = null;
    objectsToUpdate = [];
    constructor() {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World();
        this.world.gravity.set(0, -9.82, 0);
        this.followTarget = null; // カメラの追従対象
        // this.init();
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        this.renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        document.body.appendChild(this.renderer.domElement);
        //カメラの設定
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(3, 5, 5);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.enabled = false; // カメラ自動追従にするのでマウス制御を無効化
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            // カメラ追従処理（追従対象があれば）
            if (this.followTarget) {
                const targetPos = this.followTarget.position;
                const camOffset = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 5, 10);
                const newCamPos = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(targetPos.x + camOffset.x, targetPos.y + camOffset.y, targetPos.z + camOffset.z);
                this.camera.position.clone().lerp(newCamPos, 0.05); // なめらかに追従
                this.camera.lookAt(targetPos.x, targetPos.y, targetPos.z);
            }
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        this.renderer.domElement.style.cssFloat = "left";
        this.renderer.domElement.style.margin = "10px";
        return this.renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        //物理演算を行う空間の作成　ここで重力も設定
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        //friction(摩擦係数def→0.3),restitution(反発係数:def→0.0)の設定
        world.defaultContactMaterial.friction = 0.025;
        world.defaultContactMaterial.restitution = 0.9;
        //平面の作成　地面
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0xffffff });
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(50, 50);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        //ドミノ用の直方体を作成
        const dominogeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.5, 1, 0.2);
        const dominomaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshLambertMaterial({ color: 0x00ff00 });
        const domino = [];
        let dominoNum = 10; //ドミノの数
        let dominoSpacing = 0.6; // 間隔
        for (let i = 0; i < dominoNum; i++) {
            domino[i] = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(dominogeometry, dominomaterial);
            domino[i].position.set(i * dominoSpacing - 4, 0.5, 0); // x方向に並べる
            domino[i].rotation.set(0, Math.PI / 2, 0);
            this.scene.add(domino[i]);
        }
        //ボール作成
        const ballGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(0.2, 32, 32);
        const ballMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xffaa00 });
        const ballMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(ballGeometry, ballMaterial);
        ballMesh.position.set(-7, 5, 0);
        this.scene.add(ballMesh);
        // シーソー
        const leverGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(5, 0.2, 0.4);
        const leverMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x00ffff });
        const leverMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(leverGeometry, leverMaterial);
        leverMesh.rotation.set(0, 0, 0.01);
        leverMesh.position.set(-8, 1.5, 0);
        this.scene.add(leverMesh);
        // 支点用メッシュ（目印用など）
        const pivotGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(0.1, 16, 16);
        const pivotMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xff0000 });
        const pivotMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(pivotGeometry, pivotMaterial);
        // スイッチ（判定用オブジェクト）
        const switchGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.3, 0.1, 0.3);
        const switchMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xff0000 });
        const switchMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(switchGeometry, switchMaterial);
        switchMesh.position.set(domino[dominoNum - 1].position.x + 1, 0.05, 0); // 最後のドミノの横
        this.scene.add(switchMesh);
        //ジャンプ台
        const jumpBoxGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(1.5, 0.5, 1); // 跳び箱っぽいサイズ
        const jumpBoxMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xdd8833 });
        const jumpBoxMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(jumpBoxGeometry, jumpBoxMaterial);
        jumpBoxMesh.position.set(domino[dominoNum - 1].position.x + 3, 0.25, 0); // 地面に配置
        jumpBoxMesh.rotation.set(0, 0, -0.001); // 少し斜めにして跳ねやすく
        this.scene.add(jumpBoxMesh);
        // ジャンプするボールのMesh（最初は非表示でもOK）
        const ball2Mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(ballGeometry, ballMaterial);
        ball2Mesh.position.set(domino[dominoNum - 1].position.x + 3, 0.7, 0); // ジャンプ台の上に待機
        this.scene.add(ball2Mesh);
        //cannon-esの物理演算用の空間にも物体を作成する必要がある
        //形状　BoxGeometryの大きさの半分
        //重さ massはkg単位
        //位置情報と回転成分（クォータニオン）をコピー
        //物理演算用と表示表の空間は別に設定されているから
        //物理演算の空間内にも平面を作成
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        planeBody.addShape(planeShape); //形状を登録
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        //ドミノ　物理演算の空間にも作成　大きさ半分に　形状
        const dominoShape = [];
        const dominoBody = [];
        for (let i = 0; i < dominoNum; i++) {
            dominoShape[i] = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.25, 0.5, 0.1));
            //ドミノの重さ
            dominoBody[i] = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
            dominoBody[i].addShape(dominoShape[i]); //形状を登録
            //コピー
            dominoBody[i].position.set(domino[i].position.x, domino[i].position.y, domino[i].position.z);
            dominoBody[i].quaternion.set(domino[i].quaternion.x, domino[i].quaternion.y, domino[i].quaternion.z, domino[i].quaternion.w);
        }
        //物理演算用の空間に ボール
        const ballBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0.4 });
        ballBody.addShape(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(0.2));
        ballBody.position.set(ballMesh.position.x, ballMesh.position.y, ballMesh.position.z);
        // world.addBody(ballBody);
        // this.followTarget = ballBody;
        //シーソー
        const leverShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(2.5, 0.1, 0.2));
        const leverBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0.5 });
        leverBody.addShape(leverShape);
        leverBody.position.set(leverMesh.position.x, leverMesh.position.y, leverMesh.position.z);
        leverBody.quaternion.set(leverMesh.quaternion.x, leverMesh.quaternion.y, leverMesh.quaternion.z, leverMesh.quaternion.w);
        // 支点
        const pivotBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        pivotBody.position.set(leverMesh.position.x, leverMesh.position.y, 0);
        // ヒンジ設定　シーソーの固定
        const hinge = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.HingeConstraint(leverBody, pivotBody, {
            pivotA: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 0, 0),
            axisA: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 0, 1),
            pivotB: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 0, 0),
            axisB: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, 0, 1)
        });
        // スイッチ用のCannon Body（固定）
        const switchShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.15, 0.05, 0.15));
        const switchBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        switchBody.addShape(switchShape);
        switchBody.position.set(switchMesh.position.x, switchMesh.position.y, switchMesh.position.z);
        //ジャンプ台
        const jumpBoxShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0.75, 0.25, 0.5));
        const jumpBoxBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 }); // 固定
        jumpBoxBody.addShape(jumpBoxShape);
        jumpBoxBody.position.set(jumpBoxMesh.position.x, jumpBoxMesh.position.y, jumpBoxMesh.position.z);
        jumpBoxBody.quaternion.set(jumpBoxMesh.quaternion.x, jumpBoxMesh.quaternion.y, jumpBoxMesh.quaternion.z, jumpBoxMesh.quaternion.w);
        // ジャンプするボールのBody
        const ball2Body = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0.4 });
        ball2Body.addShape(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Sphere(0.2));
        ball2Body.position.set(ball2Mesh.position.x, ball2Mesh.position.y, ball2Mesh.position.z);
        const jumpMaterial = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material();
        const ball2Material = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Material();
        world.addContactMaterial(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.ContactMaterial(jumpMaterial, ball2Material, {
            friction: 0.6,
            restitution: 0.9
        }));
        jumpBoxBody.material = jumpMaterial;
        ball2Body.material = ball2Material;
        // 衝突フラグ
        let switchTriggered = false;
        // 毎ステップ処理
        world.addEventListener('postStep', () => {
            // console.log("ボール2位置:", ball2Body.position); // ←動いてるか？
            // console.log("速度:", ball2Body.velocity); // ←何も変化してないなら applyImpulse 効いてない
            if (!switchTriggered) {
                for (let i = 0; i < world.contacts.length; i++) {
                    const contact = world.contacts[i];
                    if ((contact.bi === switchBody && contact.bj === dominoBody[dominoNum - 1]) ||
                        (contact.bj === switchBody && contact.bi === dominoBody[dominoNum - 1])) {
                        console.log("スイッチ押された");
                        switchTriggered = true;
                        // ボールにインパルスを与える（ジャンプ）
                        ball2Body.wakeUp();
                        const impulse = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(3, 6, 0); // 調整可
                        ball2Body.applyImpulse(impulse, ball2Body.position);
                        this.followTarget = ball2Body; // ball2Body にカメラを追従させる
                        // 数秒後にリセットしてループ
                        setTimeout(() => {
                            resetSimulation();
                        }, 2450); // 秒後にリセット（時間は調整可）
                        // エフェクトや色変化も追加可能
                        //switchMesh.material.color.set(0xffff00); // 押された演出
                        break;
                    }
                }
            }
            // 毎ステップで位置をMeshに反映
            ball2Mesh.position.set(ball2Body.position.x, ball2Body.position.y + 0.03, ball2Body.position.z);
            ball2Mesh.quaternion.set(ball2Body.quaternion.x, ball2Body.quaternion.y, ball2Body.quaternion.z, ball2Body.quaternion.w);
        });
        //物理演算用の空間に追加
        //world.addBody(cubeBody);
        world.addBody(planeBody); //平面
        //ドミノ
        for (let i = 0; i < dominoNum; i++) {
            world.addBody(dominoBody[i]);
        }
        world.addBody(ballBody); //ボール
        world.addBody(leverBody); //シーソー
        world.addBody(pivotBody); //支点
        world.addConstraint(hinge); //ヒンジ
        world.addBody(switchBody); //スイッチボタン
        world.addBody(jumpBoxBody); //ジャンプ台
        world.addBody(ball2Body); //ボール2
        //  this.followTarget = ballBody;
        //ループ用のリセット
        const resetSimulation = () => {
            // ボール
            ballBody.velocity.setZero();
            ballBody.angularVelocity.setZero();
            ballBody.position.set(-7, 5, 0);
            ballBody.quaternion.set(0, 0, 0, 1);
            // ドミノ
            for (let i = 0; i < dominoNum; i++) {
                dominoBody[i].velocity.setZero();
                dominoBody[i].angularVelocity.setZero();
                dominoBody[i].position.set(i * dominoSpacing - 4, 0.5, 0);
                dominoBody[i].quaternion.setFromEuler(0, Math.PI / 2, 0);
            }
            // シーソー
            leverBody.velocity.setZero();
            leverBody.angularVelocity.setZero();
            leverBody.position.set(-8, 1.5, 0);
            leverBody.quaternion.set(0, 0, 0, 1);
            // ball2（ジャンプしたボール）
            ball2Body.velocity.setZero();
            ball2Body.angularVelocity.setZero();
            ball2Body.position.set(domino[dominoNum - 1].position.x + 2, 0.7, 0);
            ball2Body.quaternion.set(0, 0, 0, 1);
            // フラグもリセット
            switchTriggered = false;
            this.followTarget = null; // リセット時に追従を解除して元のカメラに戻す
        };
        // グリッド表示
        // const gridHelper = new THREE.GridHelper(10,);
        // this.scene.add(gridHelper);
        // 軸表示
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 1.5);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        let update = (time) => {
            //物理演算を実行
            world.fixedStep();
            //実行結果を表示用の世界に反映  
            //ドミノ　反映
            for (let i = 0; i < dominoNum; i++) {
                domino[i].position.set(dominoBody[i].position.x, dominoBody[i].position.y, dominoBody[i].position.z);
                domino[i].quaternion.set(dominoBody[i].quaternion.x, dominoBody[i].quaternion.y, dominoBody[i].quaternion.z, dominoBody[i].quaternion.w);
            }
            ballMesh.position.set(ballBody.position.x, ballBody.position.y, ballBody.position.z);
            ballMesh.quaternion.set(ballBody.quaternion.x, ballBody.quaternion.y, ballBody.quaternion.z, ballBody.quaternion.w);
            leverMesh.position.set(leverBody.position.x, leverBody.position.y, leverBody.position.z);
            leverMesh.quaternion.set(leverBody.quaternion.x, leverBody.quaternion.y, leverBody.quaternion.z, leverBody.quaternion.w);
            pivotMesh.position.set(pivotBody.position.x, pivotBody.position.y, pivotBody.position.z);
            pivotMesh.quaternion.set(pivotBody.quaternion.x, pivotBody.quaternion.y, pivotBody.quaternion.z, pivotBody.quaternion.w);
            // weightMesh.position.set(weightBody.position.x, weightBody.position.y, weightBody.position.z);
            // weightMesh.quaternion.set(weightBody.quaternion.x, weightBody.quaternion.y, weightBody.quaternion.z, weightBody.quaternion.w);
            // ball2Mesh.position.set(ball2Body.position.x, ball2Body.position.y, ball2Body.position.z);
            // ball2Mesh.quaternion.set(ball2Body.quaternion.x, ball2Body.quaternion.y, ball2Body.quaternion.z, ball2Body.quaternion.w);
            // カメラ追従処理
            if (this.followTarget) {
                const targetPosition = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(this.followTarget.position.x, this.followTarget.position.y + 5, this.followTarget.position.z + 10);
                this.camera.position.clone().lerp(targetPosition, 0.05);
                this.camera.lookAt(this.followTarget.position.x, this.followTarget.position.y, this.followTarget.position.z);
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vMjNGSTA2MCDpq5nmqYvnlLHpurtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuXG4gICAgcHJpdmF0ZSBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICAgIHByaXZhdGUgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gICAgcHJpdmF0ZSBjb250cm9sczogT3JiaXRDb250cm9scztcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG4gICAgcHJpdmF0ZSBmb2xsb3dUYXJnZXQ6IENBTk5PTi5Cb2R5IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBvYmplY3RzVG9VcGRhdGU6IHsgbWVzaDogVEhSRUUuTWVzaCwgYm9keTogQ0FOTk9OLkJvZHkgfVtdID0gW107XG5cblxuICAgIGNvbnN0cnVjdG9yKCkge1xudGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKCk7XG4gICAgdGhpcy53b3JsZC5ncmF2aXR5LnNldCgwLCAtOS44MiwgMCk7XG5cbiAgICB0aGlzLmZvbGxvd1RhcmdldCA9IG51bGw7IC8vIOOCq+ODoeODqeOBrui/veW+k+WvvuixoVxuXG4gICAgICAgIC8vIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgIHRoaXMucmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSB0cnVlOy8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KDMsNSw1KTtcbiAgICB0aGlzLmNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyh0aGlzLmNhbWVyYSwgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcbiAgICAgICAgb3JiaXRDb250cm9scy5lbmFibGVkID0gZmFsc2U7ICAvLyDjgqvjg6Hjg6noh6rli5Xov73lvpPjgavjgZnjgovjga7jgafjg57jgqbjgrnliLblvqHjgpLnhKHlirnljJZcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuLy8g44Kr44Oh44Op6L+95b6T5Yem55CG77yI6L+95b6T5a++6LGh44GM44GC44KM44Gw77yJXG4gICAgaWYgKHRoaXMuZm9sbG93VGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldFBvcyA9IHRoaXMuZm9sbG93VGFyZ2V0LnBvc2l0aW9uO1xuICAgICAgICBjb25zdCBjYW1PZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCA1LCAxMCk7XG4gICAgICAgIGNvbnN0IG5ld0NhbVBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgICAgICAgdGFyZ2V0UG9zLnggKyBjYW1PZmZzZXQueCxcbiAgICAgICAgICAgIHRhcmdldFBvcy55ICsgY2FtT2Zmc2V0LnksXG4gICAgICAgICAgICB0YXJnZXRQb3MueiArIGNhbU9mZnNldC56XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLmxlcnAobmV3Q2FtUG9zLCAwLjA1KTsgLy8g44Gq44KB44KJ44GL44Gr6L+95b6TXG4gICAgICAgIHRoaXMuY2FtZXJhLmxvb2tBdCh0YXJnZXRQb3MueCwgdGFyZ2V0UG9zLnksIHRhcmdldFBvcy56KTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICAgICAgLy/niannkIbmvJTnrpfjgpLooYzjgYbnqbrplpPjga7kvZzmiJDjgIDjgZPjgZPjgafph43lipvjgoLoqK3lrppcbiAgICAgICAgY29uc3Qgd29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcblxuICAgICAgICAvL2ZyaWN0aW9uKOaRqeaTpuS/guaVsGRlZuKGkjAuMykscmVzdGl0dXRpb24o5Y+N55m65L+C5pWwOmRlZuKGkjAuMCnjga7oqK3lrppcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDI1O1xuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC45O1xuXG5cblxuICAgICAgICAvL+W5s+mdouOBruS9nOaIkOOAgOWcsOmdolxuICAgICAgICBjb25zdCBwaG9uZ01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHtjb2xvcjoweGZmZmZmZn0pO1xuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNTAsIDUwKTtcbiAgICAgICAgY29uc3QgcGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGhvbmdNYXRlcmlhbCk7XG4gICAgICAgIHBsYW5lTWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTsgLy8g5Lih6Z2iXG4gICAgICAgIHBsYW5lTWVzaC5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lTWVzaCk7XG5cbiAgICAgICAgLy/jg4njg5/jg47nlKjjga7nm7TmlrnkvZPjgpLkvZzmiJBcbiAgICAgICAgY29uc3QgZG9taW5vZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMC41LCAxLCAwLjIpO1xuICAgICAgICBjb25zdCBkb21pbm9tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4MDBmZjAwIH0pO1xuICAgICAgICBjb25zdCBkb21pbm8gPSBbXTtcbiAgICAgICAgbGV0IGRvbWlub051bSA9IDEwOyAvL+ODieODn+ODjuOBruaVsFxuXG4gICAgICAgIGxldCBkb21pbm9TcGFjaW5nID0gMC42OyAvLyDplpPpmpRcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb21pbm9OdW07IGkrKykge1xuICAgICAgICAgICAgZG9taW5vW2ldID0gbmV3IFRIUkVFLk1lc2goZG9taW5vZ2VvbWV0cnksIGRvbWlub21hdGVyaWFsKTtcbiAgICAgICAgICAgIGRvbWlub1tpXS5wb3NpdGlvbi5zZXQoaSAqIGRvbWlub1NwYWNpbmcgLSA0LCAwLjUsIDApOyAvLyB45pa55ZCR44Gr5Lim44G544KLXG4gICAgICAgICAgICBkb21pbm9baV0ucm90YXRpb24uc2V0KDAsIE1hdGguUEkgLyAyLCAwKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGRvbWlub1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvL+ODnOODvOODq+S9nOaIkFxuICAgICAgICBjb25zdCBiYWxsR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMC4yLCAzMiwgMzIpO1xuICAgICAgICBjb25zdCBiYWxsTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmFhMDAgfSk7XG4gICAgICAgIGNvbnN0IGJhbGxNZXNoID0gbmV3IFRIUkVFLk1lc2goYmFsbEdlb21ldHJ5LCBiYWxsTWF0ZXJpYWwpO1xuICAgICAgICBiYWxsTWVzaC5wb3NpdGlvbi5zZXQoLTcsIDUsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChiYWxsTWVzaCk7XG5cbiAgICAgICAgLy8g44K344O844K944O8XG4gICAgICAgIGNvbnN0IGxldmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoNSwgMC4yLCAwLjQpO1xuICAgICAgICBjb25zdCBsZXZlck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MDBmZmZmIH0pO1xuICAgICAgICBjb25zdCBsZXZlck1lc2ggPSBuZXcgVEhSRUUuTWVzaChsZXZlckdlb21ldHJ5LCBsZXZlck1hdGVyaWFsKTtcbiAgICAgICAgbGV2ZXJNZXNoLnJvdGF0aW9uLnNldCgwLCAwLCAwLjAxKTtcbiAgICAgICAgbGV2ZXJNZXNoLnBvc2l0aW9uLnNldCgtOCwgMS41LCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGV2ZXJNZXNoKTtcblxuICAgICAgICAvLyDmlK/ngrnnlKjjg6Hjg4Pjgrfjg6XvvIjnm67ljbDnlKjjgarjganvvIlcbiAgICAgICAgY29uc3QgcGl2b3RHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjEsIDE2LCAxNik7XG4gICAgICAgIGNvbnN0IHBpdm90TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgICAgIGNvbnN0IHBpdm90TWVzaCA9IG5ldyBUSFJFRS5NZXNoKHBpdm90R2VvbWV0cnksIHBpdm90TWF0ZXJpYWwpO1xuXG4gICAgICAgIC8vIOOCueOCpOODg+ODge+8iOWIpOWumueUqOOCquODluOCuOOCp+OCr+ODiO+8iVxuICAgICAgICBjb25zdCBzd2l0Y2hHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjMsIDAuMSwgMC4zKTtcbiAgICAgICAgY29uc3Qgc3dpdGNoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgICAgIGNvbnN0IHN3aXRjaE1lc2ggPSBuZXcgVEhSRUUuTWVzaChzd2l0Y2hHZW9tZXRyeSwgc3dpdGNoTWF0ZXJpYWwpO1xuICAgICAgICBzd2l0Y2hNZXNoLnBvc2l0aW9uLnNldChkb21pbm9bZG9taW5vTnVtIC0gMV0ucG9zaXRpb24ueCArIDEsIDAuMDUsIDApOyAvLyDmnIDlvozjga7jg4njg5/jg47jga7mqKpcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoc3dpdGNoTWVzaCk7XG5cbiAgICAgICAgLy/jgrjjg6Pjg7Pjg5flj7BcbiAgICAgICAgY29uc3QganVtcEJveEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDEuNSwgMC41LCAxKTsgLy8g6Lez44Gz566x44Gj44G944GE44K144Kk44K6XG4gICAgICAgIGNvbnN0IGp1bXBCb3hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweGRkODgzMyB9KTtcbiAgICAgICAgY29uc3QganVtcEJveE1lc2ggPSBuZXcgVEhSRUUuTWVzaChqdW1wQm94R2VvbWV0cnksIGp1bXBCb3hNYXRlcmlhbCk7XG4gICAgICAgIGp1bXBCb3hNZXNoLnBvc2l0aW9uLnNldChkb21pbm9bZG9taW5vTnVtIC0gMV0ucG9zaXRpb24ueCArIDMsIDAuMjUsIDApOyAvLyDlnLDpnaLjgavphY3nva5cbiAgICAgICAganVtcEJveE1lc2gucm90YXRpb24uc2V0KDAsIDAsIC0wLjAwMSk7IC8vIOWwkeOBl+aWnOOCgeOBq+OBl+OBpui3s+OBreOChOOBmeOBj1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChqdW1wQm94TWVzaCk7XG5cbiAgICAgICAgLy8g44K444Oj44Oz44OX44GZ44KL44Oc44O844Or44GuTWVzaO+8iOacgOWIneOBr+mdnuihqOekuuOBp+OCgk9L77yJXG4gICAgICAgIGNvbnN0IGJhbGwyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJhbGxHZW9tZXRyeSwgYmFsbE1hdGVyaWFsKTtcbiAgICAgICAgYmFsbDJNZXNoLnBvc2l0aW9uLnNldChkb21pbm9bZG9taW5vTnVtIC0gMV0ucG9zaXRpb24ueCArIDMsIDAuNywgMCk7IC8vIOOCuOODo+ODs+ODl+WPsOOBruS4iuOBq+W+heapn1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChiYWxsMk1lc2gpO1xuXG5cblxuXG4gICAgICAgIC8vY2Fubm9uLWVz44Gu54mp55CG5ryU566X55So44Gu56m66ZaT44Gr44KC54mp5L2T44KS5L2c5oiQ44GZ44KL5b+F6KaB44GM44GC44KLXG5cbiAgICAgICAgLy/lvaLnirbjgIBCb3hHZW9tZXRyeeOBruWkp+OBjeOBleOBruWNiuWIhlxuICAgICAgICAvL+mHjeOBlSBtYXNz44Gva2fljZjkvY1cbiAgICAgICAgLy/kvY3nva7mg4XloLHjgajlm57ou6LmiJDliIbvvIjjgq/jgqnjg7zjgr/jg4vjgqrjg7PvvInjgpLjgrPjg5Tjg7xcbiAgICAgICAgLy/niannkIbmvJTnrpfnlKjjgajooajnpLrooajjga7nqbrplpPjga/liKXjgavoqK3lrprjgZXjgozjgabjgYTjgovjgYvjgolcblxuICAgICAgICAvL+eJqeeQhua8lOeul+OBruepuumWk+WGheOBq+OCguW5s+mdouOCkuS9nOaIkFxuICAgICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpXG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSlcbiAgICAgICAgcGxhbmVCb2R5LmFkZFNoYXBlKHBsYW5lU2hhcGUpLy/lvaLnirbjgpLnmbvpjLJcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpO1xuXG4gICAgICAgIC8v44OJ44Of44OO44CA54mp55CG5ryU566X44Gu56m66ZaT44Gr44KC5L2c5oiQ44CA5aSn44GN44GV5Y2K5YiG44Gr44CA5b2i54q2XG4gICAgICAgIGNvbnN0IGRvbWlub1NoYXBlID0gW11cbiAgICAgICAgY29uc3QgZG9taW5vQm9keSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9taW5vTnVtOyBpKyspIHtcbiAgICAgICAgICAgIGRvbWlub1NoYXBlW2ldID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDAuMjUsIDAuNSwgMC4xKSk7XG4gICAgICAgICAgICAvL+ODieODn+ODjuOBrumHjeOBlVxuICAgICAgICAgICAgZG9taW5vQm9keVtpXSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG4gICAgICAgICAgICBkb21pbm9Cb2R5W2ldLmFkZFNoYXBlKGRvbWlub1NoYXBlW2ldKTsvL+W9oueKtuOCkueZu+mMslxuICAgICAgICAgICAgLy/jgrPjg5Tjg7xcbiAgICAgICAgICAgIGRvbWlub0JvZHlbaV0ucG9zaXRpb24uc2V0KGRvbWlub1tpXS5wb3NpdGlvbi54LCBkb21pbm9baV0ucG9zaXRpb24ueSwgZG9taW5vW2ldLnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgZG9taW5vQm9keVtpXS5xdWF0ZXJuaW9uLnNldChkb21pbm9baV0ucXVhdGVybmlvbi54LCBkb21pbm9baV0ucXVhdGVybmlvbi55LCBkb21pbm9baV0ucXVhdGVybmlvbi56LCBkb21pbm9baV0ucXVhdGVybmlvbi53KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v54mp55CG5ryU566X55So44Gu56m66ZaT44GrIOODnOODvOODq1xuICAgICAgICBjb25zdCBiYWxsQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAuNCB9KTtcbiAgICAgICAgYmFsbEJvZHkuYWRkU2hhcGUobmV3IENBTk5PTi5TcGhlcmUoMC4yKSk7XG4gICAgICAgIGJhbGxCb2R5LnBvc2l0aW9uLnNldChiYWxsTWVzaC5wb3NpdGlvbi54LCBiYWxsTWVzaC5wb3NpdGlvbi55LCBiYWxsTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgLy8gd29ybGQuYWRkQm9keShiYWxsQm9keSk7XG4gICAgICAgIC8vIHRoaXMuZm9sbG93VGFyZ2V0ID0gYmFsbEJvZHk7XG5cbiAgICAgICAgLy/jgrfjg7zjgr3jg7xcbiAgICAgICAgY29uc3QgbGV2ZXJTaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygyLjUsIDAuMSwgMC4yKSk7XG4gICAgICAgIGNvbnN0IGxldmVyQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAuNSB9KTtcbiAgICAgICAgbGV2ZXJCb2R5LmFkZFNoYXBlKGxldmVyU2hhcGUpO1xuICAgICAgICBsZXZlckJvZHkucG9zaXRpb24uc2V0KGxldmVyTWVzaC5wb3NpdGlvbi54LCBsZXZlck1lc2gucG9zaXRpb24ueSwgbGV2ZXJNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICBsZXZlckJvZHkucXVhdGVybmlvbi5zZXQobGV2ZXJNZXNoLnF1YXRlcm5pb24ueCwgbGV2ZXJNZXNoLnF1YXRlcm5pb24ueSwgbGV2ZXJNZXNoLnF1YXRlcm5pb24ueiwgbGV2ZXJNZXNoLnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgLy8g5pSv54K5XG4gICAgICAgIGNvbnN0IHBpdm90Qm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBpdm90Qm9keS5wb3NpdGlvbi5zZXQobGV2ZXJNZXNoLnBvc2l0aW9uLngsIGxldmVyTWVzaC5wb3NpdGlvbi55LCAwKTtcblxuICAgICAgICAvLyDjg5Ljg7PjgrjoqK3lrprjgIDjgrfjg7zjgr3jg7zjga7lm7rlrppcbiAgICAgICAgY29uc3QgaGluZ2UgPSBuZXcgQ0FOTk9OLkhpbmdlQ29uc3RyYWludChsZXZlckJvZHksIHBpdm90Qm9keSwge1xuICAgICAgICAgICAgcGl2b3RBOiBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMCksXG4gICAgICAgICAgICBheGlzQTogbmV3IENBTk5PTi5WZWMzKDAsIDAsIDEpLFxuICAgICAgICAgICAgcGl2b3RCOiBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMCksXG4gICAgICAgICAgICBheGlzQjogbmV3IENBTk5PTi5WZWMzKDAsIDAsIDEpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOOCueOCpOODg+ODgeeUqOOBrkNhbm5vbiBCb2R577yI5Zu65a6a77yJXG4gICAgICAgIGNvbnN0IHN3aXRjaFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDAuMTUsIDAuMDUsIDAuMTUpKTtcbiAgICAgICAgY29uc3Qgc3dpdGNoQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHN3aXRjaEJvZHkuYWRkU2hhcGUoc3dpdGNoU2hhcGUpO1xuICAgICAgICBzd2l0Y2hCb2R5LnBvc2l0aW9uLnNldChzd2l0Y2hNZXNoLnBvc2l0aW9uLngsIHN3aXRjaE1lc2gucG9zaXRpb24ueSwgc3dpdGNoTWVzaC5wb3NpdGlvbi56KTtcblxuICAgICAgICAvL+OCuOODo+ODs+ODl+WPsFxuICAgICAgICBjb25zdCBqdW1wQm94U2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoMC43NSwgMC4yNSwgMC41KSk7XG4gICAgICAgIGNvbnN0IGp1bXBCb3hCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTsgLy8g5Zu65a6aXG4gICAgICAgIGp1bXBCb3hCb2R5LmFkZFNoYXBlKGp1bXBCb3hTaGFwZSk7XG4gICAgICAgIGp1bXBCb3hCb2R5LnBvc2l0aW9uLnNldChqdW1wQm94TWVzaC5wb3NpdGlvbi54LCBqdW1wQm94TWVzaC5wb3NpdGlvbi55LCBqdW1wQm94TWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAganVtcEJveEJvZHkucXVhdGVybmlvbi5zZXQoanVtcEJveE1lc2gucXVhdGVybmlvbi54LCBqdW1wQm94TWVzaC5xdWF0ZXJuaW9uLnksIGp1bXBCb3hNZXNoLnF1YXRlcm5pb24ueiwganVtcEJveE1lc2gucXVhdGVybmlvbi53KTtcblxuICAgICAgICAvLyDjgrjjg6Pjg7Pjg5fjgZnjgovjg5zjg7zjg6vjga5Cb2R5XG4gICAgICAgIGNvbnN0IGJhbGwyQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAuNCB9KTtcbiAgICAgICAgYmFsbDJCb2R5LmFkZFNoYXBlKG5ldyBDQU5OT04uU3BoZXJlKDAuMikpO1xuICAgICAgICBiYWxsMkJvZHkucG9zaXRpb24uc2V0KGJhbGwyTWVzaC5wb3NpdGlvbi54LCBiYWxsMk1lc2gucG9zaXRpb24ueSwgYmFsbDJNZXNoLnBvc2l0aW9uLnopO1xuXG4gICAgICAgIGNvbnN0IGp1bXBNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoKTtcbiAgICAgICAgY29uc3QgYmFsbDJNYXRlcmlhbCA9IG5ldyBDQU5OT04uTWF0ZXJpYWwoKTtcbiAgICAgICAgd29ybGQuYWRkQ29udGFjdE1hdGVyaWFsKG5ldyBDQU5OT04uQ29udGFjdE1hdGVyaWFsKGp1bXBNYXRlcmlhbCwgYmFsbDJNYXRlcmlhbCwge1xuICAgICAgICAgICAgZnJpY3Rpb246IDAuNixcbiAgICAgICAgICAgIHJlc3RpdHV0aW9uOiAwLjlcbiAgICAgICAgfSkpO1xuICAgICAgICBqdW1wQm94Qm9keS5tYXRlcmlhbCA9IGp1bXBNYXRlcmlhbDtcbiAgICAgICAgYmFsbDJCb2R5Lm1hdGVyaWFsID0gYmFsbDJNYXRlcmlhbDtcblxuICAgICAgICAvLyDooZ3nqoHjg5Xjg6njgrBcbiAgICAgICAgbGV0IHN3aXRjaFRyaWdnZXJlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIOavjuOCueODhuODg+ODl+WHpueQhlxuICAgICAgICB3b3JsZC5hZGRFdmVudExpc3RlbmVyKCdwb3N0U3RlcCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwi44Oc44O844OrMuS9jee9rjpcIiwgYmFsbDJCb2R5LnBvc2l0aW9uKTsgLy8g4oaQ5YuV44GE44Gm44KL44GL77yfXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIumAn+W6pjpcIiwgYmFsbDJCb2R5LnZlbG9jaXR5KTsgLy8g4oaQ5L2V44KC5aSJ5YyW44GX44Gm44Gq44GE44Gq44KJIGFwcGx5SW1wdWxzZSDlirnjgYTjgabjgarjgYRcblxuICAgICAgICAgICAgaWYgKCFzd2l0Y2hUcmlnZ2VyZWQpIHtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29ybGQuY29udGFjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGFjdCA9IHdvcmxkLmNvbnRhY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29udGFjdC5iaSA9PT0gc3dpdGNoQm9keSAmJiBjb250YWN0LmJqID09PSBkb21pbm9Cb2R5W2RvbWlub051bSAtIDFdKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnRhY3QuYmogPT09IHN3aXRjaEJvZHkgJiYgY29udGFjdC5iaSA9PT0gZG9taW5vQm9keVtkb21pbm9OdW0gLSAxXSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOCueOCpOODg+ODgeaKvOOBleOCjOOBn1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaFRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDjg5zjg7zjg6vjgavjgqTjg7Pjg5Hjg6vjgrnjgpLkuI7jgYjjgovvvIjjgrjjg6Pjg7Pjg5fvvIlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbGwyQm9keS53YWtlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltcHVsc2UgPSBuZXcgQ0FOTk9OLlZlYzMoMywgNiwgMCk7IC8vIOiqv+aVtOWPr1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFsbDJCb2R5LmFwcGx5SW1wdWxzZShpbXB1bHNlLCBiYWxsMkJvZHkucG9zaXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGxvd1RhcmdldCA9IGJhbGwyQm9keTsgIC8vIGJhbGwyQm9keSDjgavjgqvjg6Hjg6njgpLov73lvpPjgZXjgZvjgotcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaVsOenkuW+jOOBq+ODquOCu+ODg+ODiOOBl+OBpuODq+ODvOODl1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRTaW11bGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyNDUwKTsgLy8g56eS5b6M44Gr44Oq44K744OD44OI77yI5pmC6ZaT44Gv6Kq/5pW05Y+v77yJXG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g44Ko44OV44Kn44Kv44OI44KE6Imy5aSJ5YyW44KC6L+95Yqg5Y+v6IO9XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3N3aXRjaE1lc2gubWF0ZXJpYWwuY29sb3Iuc2V0KDB4ZmZmZjAwKTsgLy8g5oq844GV44KM44Gf5ryU5Ye6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5q+O44K544OG44OD44OX44Gn5L2N572u44KSTWVzaOOBq+WPjeaYoFxuICAgICAgICAgICAgYmFsbDJNZXNoLnBvc2l0aW9uLnNldChiYWxsMkJvZHkucG9zaXRpb24ueCwgYmFsbDJCb2R5LnBvc2l0aW9uLnkgKyAwLjAzLCBiYWxsMkJvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICBiYWxsMk1lc2gucXVhdGVybmlvbi5zZXQoYmFsbDJCb2R5LnF1YXRlcm5pb24ueCwgYmFsbDJCb2R5LnF1YXRlcm5pb24ueSwgYmFsbDJCb2R5LnF1YXRlcm5pb24ueiwgYmFsbDJCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvL+eJqeeQhua8lOeul+eUqOOBruepuumWk+OBq+i/veWKoFxuICAgICAgICAvL3dvcmxkLmFkZEJvZHkoY3ViZUJvZHkpO1xuICAgICAgICB3b3JsZC5hZGRCb2R5KHBsYW5lQm9keSkgLy/lubPpnaJcbiAgICAgICAgLy/jg4njg5/jg45cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb21pbm9OdW07IGkrKykge1xuICAgICAgICAgICAgd29ybGQuYWRkQm9keShkb21pbm9Cb2R5W2ldKVxuICAgICAgICB9XG4gICAgICAgIHdvcmxkLmFkZEJvZHkoYmFsbEJvZHkpOy8v44Oc44O844OrXG4gICAgICAgIHdvcmxkLmFkZEJvZHkobGV2ZXJCb2R5KTsvL+OCt+ODvOOCveODvFxuICAgICAgICB3b3JsZC5hZGRCb2R5KHBpdm90Qm9keSk7Ly/mlK/ngrlcbiAgICAgICAgd29ybGQuYWRkQ29uc3RyYWludChoaW5nZSk7Ly/jg5Ljg7PjgrhcbiAgICAgICAgd29ybGQuYWRkQm9keShzd2l0Y2hCb2R5KTsvL+OCueOCpOODg+ODgeODnOOCv+ODs1xuICAgICAgICB3b3JsZC5hZGRCb2R5KGp1bXBCb3hCb2R5KTsvL+OCuOODo+ODs+ODl+WPsFxuICAgICAgICB3b3JsZC5hZGRCb2R5KGJhbGwyQm9keSk7Ly/jg5zjg7zjg6syXG5cbiAgICAgICAgLy8gIHRoaXMuZm9sbG93VGFyZ2V0ID0gYmFsbEJvZHk7XG5cblxuICAgICAgICAvL+ODq+ODvOODl+eUqOOBruODquOCu+ODg+ODiFxuICAgICAgICBjb25zdCByZXNldFNpbXVsYXRpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICAvLyDjg5zjg7zjg6tcbiAgICAgICAgICAgIGJhbGxCb2R5LnZlbG9jaXR5LnNldFplcm8oKTtcbiAgICAgICAgICAgIGJhbGxCb2R5LmFuZ3VsYXJWZWxvY2l0eS5zZXRaZXJvKCk7XG4gICAgICAgICAgICBiYWxsQm9keS5wb3NpdGlvbi5zZXQoLTcsIDUsIDApO1xuICAgICAgICAgICAgYmFsbEJvZHkucXVhdGVybmlvbi5zZXQoMCwgMCwgMCwgMSk7XG5cbiAgICAgICAgICAgIC8vIOODieODn+ODjlxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb21pbm9OdW07IGkrKykge1xuICAgICAgICAgICAgICAgIGRvbWlub0JvZHlbaV0udmVsb2NpdHkuc2V0WmVybygpO1xuICAgICAgICAgICAgICAgIGRvbWlub0JvZHlbaV0uYW5ndWxhclZlbG9jaXR5LnNldFplcm8oKTtcbiAgICAgICAgICAgICAgICBkb21pbm9Cb2R5W2ldLnBvc2l0aW9uLnNldChpICogZG9taW5vU3BhY2luZyAtIDQsIDAuNSwgMCk7XG4gICAgICAgICAgICAgICAgZG9taW5vQm9keVtpXS5xdWF0ZXJuaW9uLnNldEZyb21FdWxlcigwLCBNYXRoLlBJIC8gMiwgMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOOCt+ODvOOCveODvFxuICAgICAgICAgICAgbGV2ZXJCb2R5LnZlbG9jaXR5LnNldFplcm8oKTtcbiAgICAgICAgICAgIGxldmVyQm9keS5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpO1xuICAgICAgICAgICAgbGV2ZXJCb2R5LnBvc2l0aW9uLnNldCgtOCwgMS41LCAwKTtcbiAgICAgICAgICAgIGxldmVyQm9keS5xdWF0ZXJuaW9uLnNldCgwLCAwLCAwLCAxKTtcblxuICAgICAgICAgICAgLy8gYmFsbDLvvIjjgrjjg6Pjg7Pjg5fjgZfjgZ/jg5zjg7zjg6vvvIlcbiAgICAgICAgICAgIGJhbGwyQm9keS52ZWxvY2l0eS5zZXRaZXJvKCk7XG4gICAgICAgICAgICBiYWxsMkJvZHkuYW5ndWxhclZlbG9jaXR5LnNldFplcm8oKTtcbiAgICAgICAgICAgIGJhbGwyQm9keS5wb3NpdGlvbi5zZXQoZG9taW5vW2RvbWlub051bSAtIDFdLnBvc2l0aW9uLnggKyAyLCAwLjcsIDApO1xuICAgICAgICAgICAgYmFsbDJCb2R5LnF1YXRlcm5pb24uc2V0KDAsIDAsIDAsIDEpO1xuXG4gICAgICAgICAgICAvLyDjg5Xjg6njgrDjgoLjg6rjgrvjg4Pjg4hcbiAgICAgICAgICAgIHN3aXRjaFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5mb2xsb3dUYXJnZXQgPSBudWxsOyAvLyDjg6rjgrvjg4Pjg4jmmYLjgavov73lvpPjgpLop6PpmaTjgZfjgablhYPjga7jgqvjg6Hjg6njgavmiLvjgZlcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIOOCsOODquODg+ODieihqOekulxuICAgICAgICAvLyBjb25zdCBncmlkSGVscGVyID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoMTAsKTtcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XG5cbiAgICAgICAgLy8g6Lu46KGo56S6XG4gICAgICAgIC8vIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcbiAgICAgICAgLy8gdGhpcy5zY2VuZS5hZGQoYXhlc0hlbHBlcik7XG5cbiAgICAgICAgLy/jg6njgqTjg4jjga7oqK3lrppcbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAxLjUpO1xuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSkubm9ybWFsaXplKCk7XG4gICAgICAgIHRoaXMubGlnaHQucG9zaXRpb24uc2V0KGx2ZWMueCwgbHZlYy55LCBsdmVjLnopO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcblxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvL+eJqeeQhua8lOeul+OCkuWun+ihjFxuICAgICAgICAgICAgd29ybGQuZml4ZWRTdGVwKCk7XG5cbiAgICAgICAgICAgIC8v5a6f6KGM57WQ5p6c44KS6KGo56S655So44Gu5LiW55WM44Gr5Y+N5pigICBcblxuICAgICAgICAgICAgLy/jg4njg5/jg47jgIDlj43mmKBcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9taW5vTnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkb21pbm9baV0ucG9zaXRpb24uc2V0KGRvbWlub0JvZHlbaV0ucG9zaXRpb24ueCwgZG9taW5vQm9keVtpXS5wb3NpdGlvbi55LCBkb21pbm9Cb2R5W2ldLnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgICAgIGRvbWlub1tpXS5xdWF0ZXJuaW9uLnNldChkb21pbm9Cb2R5W2ldLnF1YXRlcm5pb24ueCwgZG9taW5vQm9keVtpXS5xdWF0ZXJuaW9uLnksIGRvbWlub0JvZHlbaV0ucXVhdGVybmlvbi56LCBkb21pbm9Cb2R5W2ldLnF1YXRlcm5pb24udyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJhbGxNZXNoLnBvc2l0aW9uLnNldChiYWxsQm9keS5wb3NpdGlvbi54LCBiYWxsQm9keS5wb3NpdGlvbi55LCBiYWxsQm9keS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgIGJhbGxNZXNoLnF1YXRlcm5pb24uc2V0KGJhbGxCb2R5LnF1YXRlcm5pb24ueCwgYmFsbEJvZHkucXVhdGVybmlvbi55LCBiYWxsQm9keS5xdWF0ZXJuaW9uLnosIGJhbGxCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIGxldmVyTWVzaC5wb3NpdGlvbi5zZXQobGV2ZXJCb2R5LnBvc2l0aW9uLngsIGxldmVyQm9keS5wb3NpdGlvbi55LCBsZXZlckJvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICBsZXZlck1lc2gucXVhdGVybmlvbi5zZXQobGV2ZXJCb2R5LnF1YXRlcm5pb24ueCwgbGV2ZXJCb2R5LnF1YXRlcm5pb24ueSwgbGV2ZXJCb2R5LnF1YXRlcm5pb24ueiwgbGV2ZXJCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIHBpdm90TWVzaC5wb3NpdGlvbi5zZXQocGl2b3RCb2R5LnBvc2l0aW9uLngsIHBpdm90Qm9keS5wb3NpdGlvbi55LCBwaXZvdEJvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICBwaXZvdE1lc2gucXVhdGVybmlvbi5zZXQocGl2b3RCb2R5LnF1YXRlcm5pb24ueCwgcGl2b3RCb2R5LnF1YXRlcm5pb24ueSwgcGl2b3RCb2R5LnF1YXRlcm5pb24ueiwgcGl2b3RCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIC8vIHdlaWdodE1lc2gucG9zaXRpb24uc2V0KHdlaWdodEJvZHkucG9zaXRpb24ueCwgd2VpZ2h0Qm9keS5wb3NpdGlvbi55LCB3ZWlnaHRCb2R5LnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgLy8gd2VpZ2h0TWVzaC5xdWF0ZXJuaW9uLnNldCh3ZWlnaHRCb2R5LnF1YXRlcm5pb24ueCwgd2VpZ2h0Qm9keS5xdWF0ZXJuaW9uLnksIHdlaWdodEJvZHkucXVhdGVybmlvbi56LCB3ZWlnaHRCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIC8vIGJhbGwyTWVzaC5wb3NpdGlvbi5zZXQoYmFsbDJCb2R5LnBvc2l0aW9uLngsIGJhbGwyQm9keS5wb3NpdGlvbi55LCBiYWxsMkJvZHkucG9zaXRpb24ueik7XG4gICAgICAgICAgICAvLyBiYWxsMk1lc2gucXVhdGVybmlvbi5zZXQoYmFsbDJCb2R5LnF1YXRlcm5pb24ueCwgYmFsbDJCb2R5LnF1YXRlcm5pb24ueSwgYmFsbDJCb2R5LnF1YXRlcm5pb24ueiwgYmFsbDJCb2R5LnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIC8vIOOCq+ODoeODqei/veW+k+WHpueQhlxuICAgICAgICAgICAgaWYgKHRoaXMuZm9sbG93VGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2xsb3dUYXJnZXQucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2xsb3dUYXJnZXQucG9zaXRpb24ueSArIDUsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9sbG93VGFyZ2V0LnBvc2l0aW9uLnogKyAxMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ubGVycCh0YXJnZXRQb3NpdGlvbiwgMC4wNSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGxvd1RhcmdldC5wb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGxvd1RhcmdldC5wb3NpdGlvbi55LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbGxvd1RhcmdldC5wb3NpdGlvbi56XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cblxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDUsIDUsIDUpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
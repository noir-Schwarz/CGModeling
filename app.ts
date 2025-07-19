//23FI060 髙橋由麻
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es';

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private world: CANNON.World;
    private followTarget: CANNON.Body | null = null;
    private objectsToUpdate: { mesh: THREE.Mesh, body: CANNON.Body }[] = [];


    constructor() {
this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);

    this.followTarget = null; // カメラの追従対象

        // this.init();
    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
       this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(new THREE.Color(0x495ed));
    this.renderer.shadowMap.enabled = true;//シャドウマップを有効にする
    document.body.appendChild(this.renderer.domElement);

    //カメラの設定
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(3,5,5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        orbitControls.enabled = false;  // カメラ自動追従にするのでマウス制御を無効化

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
// カメラ追従処理（追従対象があれば）
    if (this.followTarget) {
        const targetPos = this.followTarget.position;
        const camOffset = new THREE.Vector3(0, 5, 10);
        const newCamPos = new THREE.Vector3(
            targetPos.x + camOffset.x,
            targetPos.y + camOffset.y,
            targetPos.z + camOffset.z
        );
        this.camera.position.lerp(newCamPos, 0.05); // なめらかに追従
        this.camera.lookAt(targetPos.x, targetPos.y, targetPos.z);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        this.renderer.domElement.style.cssFloat = "left";
        this.renderer.domElement.style.margin = "10px";
        return this.renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();

        //物理演算を行う空間の作成　ここで重力も設定
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

        //friction(摩擦係数def→0.3),restitution(反発係数:def→0.0)の設定
        world.defaultContactMaterial.friction = 0.025;
        world.defaultContactMaterial.restitution = 0.9;



        //平面の作成　地面
        const phongMaterial = new THREE.MeshPhongMaterial({color:0xffffff});
        const planeGeometry = new THREE.PlaneGeometry(50, 50);
        const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = THREE.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);

        //ドミノ用の直方体を作成
        const dominogeometry = new THREE.BoxGeometry(0.5, 1, 0.2);
        const dominomaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const domino = [];
        let dominoNum = 10; //ドミノの数

        let dominoSpacing = 0.6; // 間隔
        for (let i = 0; i < dominoNum; i++) {
            domino[i] = new THREE.Mesh(dominogeometry, dominomaterial);
            domino[i].position.set(i * dominoSpacing - 4, 0.5, 0); // x方向に並べる
            domino[i].rotation.set(0, Math.PI / 2, 0);
            this.scene.add(domino[i]);
        }

        //ボール作成
        const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
        ballMesh.position.set(-7, 5, 0);
        this.scene.add(ballMesh);

        // シーソー
        const leverGeometry = new THREE.BoxGeometry(5, 0.2, 0.4);
        const leverMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
        const leverMesh = new THREE.Mesh(leverGeometry, leverMaterial);
        leverMesh.rotation.set(0, 0, 0.01);
        leverMesh.position.set(-8, 1.5, 0);
        this.scene.add(leverMesh);

        // 支点用メッシュ（目印用など）
        const pivotGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const pivotMesh = new THREE.Mesh(pivotGeometry, pivotMaterial);

        // スイッチ（判定用オブジェクト）
        const switchGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.3);
        const switchMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const switchMesh = new THREE.Mesh(switchGeometry, switchMaterial);
        switchMesh.position.set(domino[dominoNum - 1].position.x + 1, 0.05, 0); // 最後のドミノの横
        this.scene.add(switchMesh);

        //ジャンプ台
        const jumpBoxGeometry = new THREE.BoxGeometry(1.5, 0.5, 1); // 跳び箱っぽいサイズ
        const jumpBoxMaterial = new THREE.MeshStandardMaterial({ color: 0xdd8833 });
        const jumpBoxMesh = new THREE.Mesh(jumpBoxGeometry, jumpBoxMaterial);
        jumpBoxMesh.position.set(domino[dominoNum - 1].position.x + 3, 0.25, 0); // 地面に配置
        jumpBoxMesh.rotation.set(0, 0, -0.001); // 少し斜めにして跳ねやすく
        this.scene.add(jumpBoxMesh);

        // ジャンプするボールのMesh（最初は非表示でもOK）
        const ball2Mesh = new THREE.Mesh(ballGeometry, ballMaterial);
        ball2Mesh.position.set(domino[dominoNum - 1].position.x + 3, 0.7, 0); // ジャンプ台の上に待機
        this.scene.add(ball2Mesh);




        //cannon-esの物理演算用の空間にも物体を作成する必要がある

        //形状　BoxGeometryの大きさの半分
        //重さ massはkg単位
        //位置情報と回転成分（クォータニオン）をコピー
        //物理演算用と表示表の空間は別に設定されているから

        //物理演算の空間内にも平面を作成
        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({ mass: 0 })
        planeBody.addShape(planeShape)//形状を登録
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);

        //ドミノ　物理演算の空間にも作成　大きさ半分に　形状
        const dominoShape = []
        const dominoBody = []
        for (let i = 0; i < dominoNum; i++) {
            dominoShape[i] = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.1));
            //ドミノの重さ
            dominoBody[i] = new CANNON.Body({ mass: 1 });
            dominoBody[i].addShape(dominoShape[i]);//形状を登録
            //コピー
            dominoBody[i].position.set(domino[i].position.x, domino[i].position.y, domino[i].position.z);
            dominoBody[i].quaternion.set(domino[i].quaternion.x, domino[i].quaternion.y, domino[i].quaternion.z, domino[i].quaternion.w);
        }

        //物理演算用の空間に ボール
        const ballBody = new CANNON.Body({ mass: 0.4 });
        ballBody.addShape(new CANNON.Sphere(0.2));
        ballBody.position.set(ballMesh.position.x, ballMesh.position.y, ballMesh.position.z);
        // world.addBody(ballBody);
        // this.followTarget = ballBody;

        //シーソー
        const leverShape = new CANNON.Box(new CANNON.Vec3(2.5, 0.1, 0.2));
        const leverBody = new CANNON.Body({ mass: 0.5 });
        leverBody.addShape(leverShape);
        leverBody.position.set(leverMesh.position.x, leverMesh.position.y, leverMesh.position.z);
        leverBody.quaternion.set(leverMesh.quaternion.x, leverMesh.quaternion.y, leverMesh.quaternion.z, leverMesh.quaternion.w);

        // 支点
        const pivotBody = new CANNON.Body({ mass: 0 });
        pivotBody.position.set(leverMesh.position.x, leverMesh.position.y, 0);

        // ヒンジ設定　シーソーの固定
        const hinge = new CANNON.HingeConstraint(leverBody, pivotBody, {
            pivotA: new CANNON.Vec3(0, 0, 0),
            axisA: new CANNON.Vec3(0, 0, 1),
            pivotB: new CANNON.Vec3(0, 0, 0),
            axisB: new CANNON.Vec3(0, 0, 1)
        });

        // スイッチ用のCannon Body（固定）
        const switchShape = new CANNON.Box(new CANNON.Vec3(0.15, 0.05, 0.15));
        const switchBody = new CANNON.Body({ mass: 0 });
        switchBody.addShape(switchShape);
        switchBody.position.set(switchMesh.position.x, switchMesh.position.y, switchMesh.position.z);

        //ジャンプ台
        const jumpBoxShape = new CANNON.Box(new CANNON.Vec3(0.75, 0.25, 0.5));
        const jumpBoxBody = new CANNON.Body({ mass: 0 }); // 固定
        jumpBoxBody.addShape(jumpBoxShape);
        jumpBoxBody.position.set(jumpBoxMesh.position.x, jumpBoxMesh.position.y, jumpBoxMesh.position.z);
        jumpBoxBody.quaternion.set(jumpBoxMesh.quaternion.x, jumpBoxMesh.quaternion.y, jumpBoxMesh.quaternion.z, jumpBoxMesh.quaternion.w);

        // ジャンプするボールのBody
        const ball2Body = new CANNON.Body({ mass: 0.4 });
        ball2Body.addShape(new CANNON.Sphere(0.2));
        ball2Body.position.set(ball2Mesh.position.x, ball2Mesh.position.y, ball2Mesh.position.z);

        const jumpMaterial = new CANNON.Material();
        const ball2Material = new CANNON.Material();
        world.addContactMaterial(new CANNON.ContactMaterial(jumpMaterial, ball2Material, {
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
                    if (
                        (contact.bi === switchBody && contact.bj === dominoBody[dominoNum - 1]) ||
                        (contact.bj === switchBody && contact.bi === dominoBody[dominoNum - 1])
                    ) {
                        console.log("スイッチ押された");
                        switchTriggered = true;
                        // ボールにインパルスを与える（ジャンプ）
                        ball2Body.wakeUp();
                        const impulse = new CANNON.Vec3(3, 6, 0); // 調整可
                        ball2Body.applyImpulse(impulse, ball2Body.position);

                        this.followTarget = ball2Body;  // ball2Body にカメラを追従させる
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
        world.addBody(planeBody) //平面
        //ドミノ
        for (let i = 0; i < dominoNum; i++) {
            world.addBody(dominoBody[i])
        }
        world.addBody(ballBody);//ボール
        world.addBody(leverBody);//シーソー
        world.addBody(pivotBody);//支点
        world.addConstraint(hinge);//ヒンジ
        world.addBody(switchBody);//スイッチボタン
        world.addBody(jumpBoxBody);//ジャンプ台
        world.addBody(ball2Body);//ボール2

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
        this.light = new THREE.DirectionalLight(0xffffff, 1.5);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        let update: FrameRequestCallback = (time) => {
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
                const targetPosition = new THREE.Vector3(
                    this.followTarget.position.x,
                    this.followTarget.position.y + 5,
                    this.followTarget.position.z + 10
                );
                this.camera.position.lerp(targetPosition, 0.05);
                this.camera.lookAt(
                    this.followTarget.position.x,
                    this.followTarget.position.y,
                    this.followTarget.position.z
                );
            }
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}

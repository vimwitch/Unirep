// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

// 2019 OKIMS

pragma solidity ^0.8.0;

library Pairing {

    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero. 
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {

        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return The sum of two points of G1
     */
    function plus(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {

        uint256[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success,"pairing-add-failed");
    }

    /*
     * @return The product of a point on G1 and a scalar, i.e.
     *         p == p.scalar_mul(1) and p.plus(p) == p.scalar_mul(2) for all
     *         points p.
     */
    function scalar_mul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {

        uint256[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success,"pairing-mul-failed");
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {

        G1Point[4] memory p1 = [a1, b1, c1, d1];
        G2Point[4] memory p2 = [a2, b2, c2, d2];

        uint256 inputSize = 24;
        uint256[] memory input = new uint256[](inputSize);

        for (uint256 i = 0; i < 4; i++) {
            uint256 j = i * 6;
            input[j + 0] = p1[i].X;
            input[j + 1] = p1[i].Y;
            input[j + 2] = p2[i].X[0];
            input[j + 3] = p2[i].X[1];
            input[j + 4] = p2[i].Y[0];
            input[j + 5] = p2[i].Y[1];
        }

        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success,"pairing-opcode-failed");

        return out[0] != 0;
    }
}

contract ReputationVerifier {

    using Pairing for *;

    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct VerifyingKey {
        Pairing.G1Point alpha1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[19] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alpha1 = Pairing.G1Point(uint256(20491192805390485299153009773594534940189261866228447918068658471970481763042),uint256(9383485363053290200918347156157836566562967994039712273449902621266178545958));
        vk.beta2 = Pairing.G2Point([uint256(4252822878758300859123897981450591353533073413197771768651442665752259397132),uint256(6375614351688725206403948262868962793625744043794305715222011528459656738731)], [uint256(21847035105528745403288232691147584728191162732299865338377159692350059136679),uint256(10505242626370262277552901082094356697409835680220590971873171140371331206856)]);
        vk.gamma2 = Pairing.G2Point([uint256(11559732032986387107991004021392285783925812861821192530917403151452391805634),uint256(10857046999023057135944570762232829481370756359578518086990519993285655852781)], [uint256(4082367875863433681332203403145435568316851327593401208105741076214120093531),uint256(8495653923123431417604973247489272438418190587263600148770280649306958101930)]);
        vk.delta2 = Pairing.G2Point([uint256(11559732032986387107991004021392285783925812861821192530917403151452391805634),uint256(10857046999023057135944570762232829481370756359578518086990519993285655852781)], [uint256(4082367875863433681332203403145435568316851327593401208105741076214120093531),uint256(8495653923123431417604973247489272438418190587263600148770280649306958101930)]);
        vk.IC[0] = Pairing.G1Point(uint256(14468275604396943725195441478009404304891654593334004923664861556307959919787),uint256(19479761733507088890479141926832781664712688083054829870581424376467197346668));
        vk.IC[1] = Pairing.G1Point(uint256(8312091945789930978743853163127909359260597963209355348592463960597152851152),uint256(14378843704161886443908751595030322412230488042870318993556711231847558695780));
        vk.IC[2] = Pairing.G1Point(uint256(1994013641294376916617901750356700490478469199675798191070098653869187557397),uint256(6465328126979762312095145325361372242929688756621204439911326455980840175411));
        vk.IC[3] = Pairing.G1Point(uint256(18751725091859815705169549284553458106365454077237272583927685831996850109844),uint256(19839313078547519245921475836495237271937274717874020087032099338830369734869));
        vk.IC[4] = Pairing.G1Point(uint256(4950896603127283766564097885560763401988062226483047079997091128986539589956),uint256(6379572773248985954164476139824729582291840009301583045541186501413586940415));
        vk.IC[5] = Pairing.G1Point(uint256(21099543931258165148116975911118816004491890687031732838247071665868933306868),uint256(19850470466955485972969218481467174556913733593532366057235159546423549566224));
        vk.IC[6] = Pairing.G1Point(uint256(16486440353231327564948316572677145218110740205006765890179679403796033886154),uint256(8140103475447673209516606150665815826764574294382476480195861663924148895616));
        vk.IC[7] = Pairing.G1Point(uint256(8786940255193274653830955369548202381221556148159835737318101412100633670050),uint256(2295928818623099620608689699331855862954741317816998770325135965242810311533));
        vk.IC[8] = Pairing.G1Point(uint256(17400134120676738252162825194759235808384459059965357125104157389527521788305),uint256(18908112865448211426489943273726520339908808633439761744375804403222913866737));
        vk.IC[9] = Pairing.G1Point(uint256(11629933520454031146293171602557269662908455249208836854620152350056259700848),uint256(2278971973101150842581282363222442433239870340591733885609875898826223570252));
        vk.IC[10] = Pairing.G1Point(uint256(18885124169297904608831813100820733938010380858325081763687659666934548567583),uint256(3397053649899865742065191693991081260386072370306108232571477298809537128894));
        vk.IC[11] = Pairing.G1Point(uint256(18189780541287615982895888117044750343620604496076115305533897842554549158845),uint256(1456882990933707555874997881626967800524503102900035588156036504773002589467));
        vk.IC[12] = Pairing.G1Point(uint256(9226080740117201427307335408157874166214668375683695724306447668027205375617),uint256(20984098541983400366369562745490956350930813814564328977911912023927822639197));
        vk.IC[13] = Pairing.G1Point(uint256(514521296589156392884532154370389741506591799707390527052694694565759959506),uint256(9640946398598805653418583427534377165956118595386547443286489961233115976866));
        vk.IC[14] = Pairing.G1Point(uint256(6061063231061861598000610138297398384565717013406436949589989477845915597076),uint256(3043770311887846463445157993801894422010084571704510564591989463974217080397));
        vk.IC[15] = Pairing.G1Point(uint256(12612449971772983604785202327522523285042987051739718052705168137332456927087),uint256(9811057603786191418070922901858652572933073648171538570001222971446039849956));
        vk.IC[16] = Pairing.G1Point(uint256(19288649345241068307404480270820190104791872153964591216872524985961839093370),uint256(656497089703299678360471216136932026840476488805433203329868569013958355716));
        vk.IC[17] = Pairing.G1Point(uint256(458081452870444149607248096874321623349577096647332718147091166237809443702),uint256(4120963619644903176779981412625310342051678124970090611355784600308793739999));
        vk.IC[18] = Pairing.G1Point(uint256(21853604433846929876455179553654004899550195458633583850072525898854092014343),uint256(20583020640665553997615323087990491228370960891327747627043372904048228416639));

    }
    
    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[] memory input
    ) public view returns (bool) {

        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);

        VerifyingKey memory vk = verifyingKey();

        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);

        // Make sure that proof.A, B, and C are each less than the prime q
        require(proof.A.X < PRIME_Q, "verifier-aX-gte-prime-q");
        require(proof.A.Y < PRIME_Q, "verifier-aY-gte-prime-q");

        require(proof.B.X[0] < PRIME_Q, "verifier-bX0-gte-prime-q");
        require(proof.B.Y[0] < PRIME_Q, "verifier-bY0-gte-prime-q");

        require(proof.B.X[1] < PRIME_Q, "verifier-bX1-gte-prime-q");
        require(proof.B.Y[1] < PRIME_Q, "verifier-bY1-gte-prime-q");

        require(proof.C.X < PRIME_Q, "verifier-cX-gte-prime-q");
        require(proof.C.Y < PRIME_Q, "verifier-cY-gte-prime-q");

        // Make sure that every input is less than the snark scalar field
        //for (uint256 i = 0; i < input.length; i++) {
        for (uint256 i = 0; i < 18; i++) {
            require(input[i] < SNARK_SCALAR_FIELD,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.plus(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }

        vk_x = Pairing.plus(vk_x, vk.IC[0]);

        return Pairing.pairing(
            Pairing.negate(proof.A),
            proof.B,
            vk.alpha1,
            vk.beta2,
            vk_x,
            vk.gamma2,
            proof.C,
            vk.delta2
        );
    }
}
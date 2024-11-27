for P in range(0, 10):
    for Q in range(0, 10):
        N=P*Q
        n = (P-1)*(Q-1)
        for E in range(2, n):
            for D in range(0, 100):
                if (((E*D) % n) == 1):
                    if (((36**D)%N)**E)%N == 36:
                        print(P, Q, N, n, E, D)
                        
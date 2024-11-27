for P in range(0, 100):
    for G in range(0, 100):
        x =13
        y = (G**x)%P
        k = 5
        a = (G**k)%P
        for b in range(0, 100):
            if (x*+5*b) % 46==36:
                print(b)
                        
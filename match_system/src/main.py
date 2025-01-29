#! /usr/bin/env python3

import glob
import sys
sys.path.append('gen-py')
sys.path.insert(0, glob.glob('../../')[0]) #Django项目的路径 acapp/

from match_server.match_service import Match

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from queue import Queue
from time import sleep
from threading import Thread

queue = Queue() #消息队列

class Player:
    def __init__ (self, score , uuid , username , photo , channel_name):
        self.score = score
        self.uuid = uuid
        self.username = username
        self.photo = photo
        self.channel_name = channel_name
        self.waiting_time = 0

class Pool:
    def __init__(self):
        self.players = []

    def add_player(self , player):
        print("added")
        print("add player: %s" % (player.username))
        self.players.append(player)
    
    def increase_waiting_time(self):
        for player in self.players:
            player.waiting_time += 1

    def check_match(self , a , b):
        dt = abs(a.score - b.score)
        a_max_dif = a.waiting_time * 50
        b_max_dif = b.waiting_time * 50
        return  dt <= a_max_dif and dt <= b_max_dif
    def match_success(self , ps):
        print("Match Success: %s %s" % (ps[0].username , ps[1].username))
        

    def match(self):
        while len(self.players) >= 2:
            self.players = sorted(self.players , key=lambda  p:p.score)
            flag = False
            for i in range(len(self.players) - 1):
                a,b = self.players[i] , self.players[i + 1]
                
                if self.check_match(a , b):
                    flag = True
                    self.match_success([a, b])
                    self.players = self.players[:i] + self.players[i + 2:]
                    break
                elif not flag:
                    break
            
        
        self.increase_waiting_time()


def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

def worker():
    print('worker')
    pool = Pool()
    while True:
        player = get_player_from_queue()
        if player:
            print('ready addplayer')
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)

class MatchHandler:
    def add_player(self , score , uuid , username , photo , channel_name):
        print('handler add_playerz')
        player = Player(score, uuid , username , photo , channel_name)
        queue.put(player)
        return 0   #切记return ， 不然会报错



if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

   # server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    # You could do one of these for a multithreaded server
    server = TServer.TThreadedServer(
         processor, transport, tfactory, pfactory)
    # server = TServer.TThreadPoolServer(
    #     processor, transport, tfactory, pfactory)

    Thread(target=worker , daemon=True).start()  #在server之前写

    print('Starting the server...')
    server.serve()
    print('done.')
